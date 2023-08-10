import Router from "koa-router";
import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import RecordingInfo from "../../../models/recording";
import Recording from "../../../models/recordingInfo";

const router = Router();

router.get(
  "/validMerchantSession",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({
        shop,
      });
      let sessions = await SessionInfo.find({ merchantId: doc.id });
      sessions.forEach((session) => {
        if (
          !session ||
          !session.sessionId ||
          !session.authTokens ||
          !session.browser ||
          !session.osInfo ||
          !session.userActivity ||
          !session.path ||
          !session.url ||
          !session.timestamp ||
          !session.recording ||
          !session.created ||
          !session?.updated ||
          !session.pgurl ||
          !session.isBlockIp
        ) {
          ctx.response.status = 200;
          ctx.response.body = {
            isValid: false,
          };
        }
      });
      ctx.response.status = 200;
      ctx.response.body = {
        isValid: true,
      };
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // const shop = "deepak-daphnis92.myshopify.com";
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end, page, limit } = ctx.request.body;
    console.log(start, end, page, limit);
    // let sessions = await SessionInfo.find({ merchantId: doc.id }).sort({
    //   created: -1,
    // });
    // let sessions = await SessionInfo.find({});
    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      }).sort({
        created: -1,
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      }).sort({
        created: -1,
      });
    }

    let data = [];
    let count = limit || 10;
    let pageSize = page || 1;

    let maxLimit = count * pageSize;
    let minLimit = maxLimit - count;

    sessions.forEach(async (session) => {
      let ipData = {
        name: "",
        sessionId: "",
        total_visits: 0,
        isp: "",
        Ip_Info: "",
        location: "",
        country_code: 91,
        landing_page: "",
        browser: "",
        pages: 2,
        activity: "",
        edit_page: "",
        created: "",
        startTime: -1,
        endTime: -1,
      };

      ipData.total_visits += 1;
      ipData.name = session.ipInfo;
      ipData.Ip_Info = session.ipInfo;
      ipData.isp = session.isp;
      ipData.browser = session.browser;
      ipData.activity = session.userActivity;
      ipData.location = session.location;
      ipData.country_code = session.countryCode;
      ipData.pages = session.pgurl.length;
      if (session.recording && session.recording.length !== 0) {
        ipData.sessionId = session.recording[0].recId;
        ipData.activity = session.recording[0].timeDuration;
        ipData.startTime = session.recording[0].startTime;
        ipData.endTime = session.recording[0].endTime;
      }
      ipData.created = session?.created?.getTime();
      if (session.pgurl.length !== 0) {
        ipData.landing_page = session.pgurl[0].replace(`https://${shop}`, "");
        ipData.edit_page = session.pgurl[session.pgurl.length - 1].replace(
          `https://${shop}`,
          ""
        );
      }
      data.push(ipData);
    });

    let resData = data.slice(minLimit, maxLimit);

    ctx.response.status = 200;
    ctx.response.body = {
      data: resData,
      count: data.length,
    };
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post("/local", async (ctx) => {
  try {
    const shop = "test-store-heatmap-05.myshopify.com";

    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end, page, limit } = ctx.request.body;
    console.log(start, end, page, limit);
    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // let sessions = await SessionInfo.find({});
    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    let data = [];
    let count = limit || 10;
    let pageSize = page || 1;

    let maxLimit = count * pageSize;
    let minLimit = maxLimit - count;

    sessions.forEach(async (session) => {
      let ipData = {
        name: "",
        sessionId: "",
        total_visits: 0,
        isp: "",
        Ip_Info: "",
        location: "",
        country_code: 91,
        landing_page: "",
        browser: "",
        pages: 2,
        activity: "",
        edit_page: "",
        created: "",
        startTime: -1,
        endTime: -1,
      };

      const recdata = await Recording.findOne({ sessionId: session.sessionId });
      console.log(recdata);

      ipData.total_visits += 1;
      ipData.name = session.ipInfo;
      ipData.Ip_Info = session.ipInfo;
      ipData.isp = session.isp;
      ipData.browser = session.browser;
      ipData.activity = session.userActivity;
      ipData.location = session.location;
      ipData.country_code = session.countryCode;
      ipData.pages = session.pgurl.length;
      ipData.startTime = recdata.startTime;
      ipData.endTime = recdata.endTime;
      if (session.recording && session.recording.length !== 0) {
        ipData.sessionId = session.recording[0].recId;
        ipData.activity = session.recording[0].timeDuration;
      }
      ipData.created = session?.created?.getTime();
      if (session.pgurl.length !== 0) {
        ipData.landing_page = session.pgurl[0].replace(`https://${shop}`, "");
        ipData.edit_page = session.pgurl[session.pgurl.length - 1].replace(
          `https://${shop}`,
          ""
        );
      }
      data.push(ipData);
    });

    let resData = data.slice(minLimit, maxLimit);

    ctx.response.status = 200;
    ctx.response.body = {
      data: resData,
      count: data.length,
    };
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
