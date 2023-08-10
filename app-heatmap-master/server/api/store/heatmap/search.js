import Router from "koa-router";
import HeatmapCoords from "../../../models/heatmapCoords";
import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import { m } from "framer-motion";

const router = Router();
router.post("/search", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    console.log(doc, "hskjhkh");
    var searchTerm = ctx.request.query.name;
    // name = "rohandevstore.myshopify.com/" + name;

    console.log(searchTerm, "search termmmmmmm");
    var data = await HeatmapCoords.find({
      url: { $regex: searchTerm, $options: "i" },
      merchantId: doc.id,
    });
    var map = new Map();
    var res = [];
    data.forEach((i) => {
      if (!map.has(i.url)) {
        console.log(i.url);
        map.set(i.url, true);
        res.push(i);
      }
    });

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: res,
    };
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post("/search2", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    var searchTerm = ctx.request.query.name;
    let rg = new RegExp(searchTerm, "gmi");
    // name = "rohandevstore.myshopify.com/" + name;

    const { start, end } = ctx.request.body;

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

    const blocked = await BlockedIp.find({ merchantId: doc.id });

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });

    let sessionIds = sessions.map((session) => session.sessionId);
    sessionIds = [...new Set(sessionIds)];
    console.log("most repeaters", sessionIds);

    let mapUrl = new Map();
    sessionIds.forEach((sessionId) => {
      sessions.forEach(async (session) => {
        if (session.sessionId === sessionId) {
          session.pgurl.forEach((url) => {
            if (rg.test(url)) mapUrl.set(url, (mapUrl.get(url) ?? 0) + 1);
          });
        }
      });
    });
    let data = [];
    mapUrl.forEach((key, url) => {
      let pageData = {
        url: url,
        value: key,
      };
      data.push(pageData);
    });
    console.log("%%", data);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: data,
    };
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post(
  "/most-visited-pages",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({ shop: shop });
      const { start, end } = ctx.request.body;

      let sessions = await SessionInfo.find({ merchantId: doc.id });
      const blocked = await BlockedIp.find({ merchantId: doc.id });

      blocked.forEach((ip) => {
        sessions.forEach(function (session, index, object) {
          if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
        });
      });
      console.log(sessions);

      console.log(blocked);

      if (start)
        sessions = sessions.filter(
          (session) => session?.created?.getTime() >= start
        );
      if (end)
        sessions = sessions.filter(
          (session) => session?.created?.getTime() <= end
        );

      let sessionIds = sessions.map((session) => session.sessionId);
      sessionIds = [...new Set(sessionIds)];
      console.log("most repeaters");
      console.log(sessionIds);

      let total_visits = 0,
        total_time = 0;

      let mapUrl = new Map();
      sessionIds.forEach((sessionId) => {
        sessions.forEach(async (session) => {
          if (session.sessionId === sessionId) {
            session.pgurl.forEach((url) => {
              mapUrl.set(url, (mapUrl.get(url) ?? 0) + 1);
            });
          }
        });
      });
      let data = [];
      mapUrl.forEach((key, url) => {
        let pageData = {
          name: url,
          value: key,
        };
        data.push(pageData);
      });

      data.sort((a, b) => {
        return b.value - a.value;
      });

      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/most-visited-pages/local", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
    const doc = await Merchant.findOne({ shop: shop });
    const { start, end } = ctx.request.body;

    let sessions = await SessionInfo.find({ merchantId: doc.id });
    const blocked = await BlockedIp.find({ merchantId: doc.id });

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });
    console.log(sessions);

    console.log(blocked);
    console.log(sessions[0].created.getTime());
    if (start)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() >= start
      );
    if (end)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() <= end
      );

    let sessionIds = sessions.map((session) => session.sessionId);
    sessionIds = [...new Set(sessionIds)];
    console.log("most repeaters");
    console.log(sessionIds);

    let mapUrl = new Map();
    sessionIds.forEach((sessionId) => {
      sessions.forEach((session) => {
        if (session.sessionId === sessionId) {
          session.pgurl.forEach((url) => {
            mapUrl.set(url, (mapUrl.get(url) ?? 0) + 1);
          });
        }
      });
    });

    console.log(mapUrl);

    let data = [];
    mapUrl.forEach((key, url) => {
      let pageData = {
        name: url,
        value: key,
      };
      data.push(pageData);
    });

    data.sort((a, b) => {
      return b.value - a.value;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
