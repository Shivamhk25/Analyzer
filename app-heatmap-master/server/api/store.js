import Router from "koa-router";
import Merchant from "../models/merchant";
import SessionInfo from "../models/sessionInfo";
import Shopify from "@shopify/shopify-api";
const fs = require("fs");
import { verifyRequest } from "@shopify/koa-shopify-auth";
import { getName } from "../globalSetter.js";
import RecordingInfo from "../models/recording";
import DashboardRouter from "./store/dashboard";
import RecordingRouter from "./store/recordings";
import AnalyticsRouter from "./store/analytics";
import MerchantRouter from "./store/merchant";
import HeatmapRouter from "./store/heatmap/search";
import BillingRouter from "./store/billing/billing";
import MembershipRouter from "./store/membership/membership";
import blockedIPs from "./store/settings/blockedIp";
import Visitors from "./store/visitors/visitors";

const router = Router();

router.use("/dashboard", DashboardRouter.routes());
router.use("/recordings", RecordingRouter.routes());
router.use("/visitors", Visitors.routes());
router.use("/analytics", AnalyticsRouter.routes());
router.use("/merchant", MerchantRouter.routes());
router.use("/billing", BillingRouter.routes());
router.use("/heatmap", HeatmapRouter.routes());
router.use("/membership", MembershipRouter.routes());
router.use("/settings", blockedIPs.routes());

router.get(
  "/get-browser-names",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      const doc = await Merchant.findOne({ shop: shop });
      const find = await SessionInfo.find(
        { merchantId: doc.id },
        { browser: 1, _id: 0 }
      );
      ctx.response.status = 200;
      ctx.response.body = find;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-os-names",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      const doc = await Merchant.findOne({ shop: shop });
      const find = await SessionInfo.find(
        { merchantId: doc.id },
        { osInfo: 1, _id: 0 }
      );
      ctx.response.status = 200;
      ctx.response.body = find;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-IpInfo",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      const doc = await Merchant.findOne({ shop: shop });
      const find = await SessionInfo.find(
        { merchantId: doc.id },
        { ipInfo: 1, _id: 0 }
      );
      ctx.response.status = 200;
      ctx.response.body = find;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-pathInfo",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      // const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const shop = getName();
      const doc = await Merchant.findOne({ shop: shop });
      const find = await SessionInfo.find(
        { merchantId: doc.id },
        { pathInfo: 1, _id: 0 }
      );
      ctx.response.status = 200;
      ctx.response.body = find;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-userActivity",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      const doc = await Merchant.findOne({ shop: shop });
      const find = await SessionInfo.find(
        { merchantId: doc.id },
        { userActivity: 1, _id: 0 }
      );
      ctx.response.status = 200;
      ctx.response.body = find;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-latest-visits",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const res = await SessionInfo.find({ merchantId: doc.id })
        .sort({ userActivity: 1 })
        .limit(100);

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-top-pages",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const res = await SessionInfo.find({ merchantId: doc.id }).sort({
        path: 1,
      });

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-top-browsers",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const res = await SessionInfo.find({ merchantId: doc.id }).sort({
        browser: 1,
      });

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-top-devices",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const res = await SessionInfo.find({ merchantId: doc.id }).sort({
        osInfo: 1,
      });

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/percentage-visits",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const res = await SessionInfo.find({ merchantId: doc.id });

      const visitors = res.filter((data) => data.path === "visitors").length;
      const cart = res.filter((data) => data.path === "cart").length;
      const total = res.length;

      const response = {
        visitors: (visitors * 100) / total,
        cart: (cart * 100) / total,
      };

      ctx.response.status = 200;
      ctx.response.body = response;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/registration", async (ctx) => {
  try {
    const { shop, name, email } = ctx.req.body;

    const newData = {
      shop: shop,
      name: name,
      email: email,
    };

    const doc = new Merchant(newData);

    const newMerchant = await doc.save();

    ctx.response.status = 200;
    ctx.response.body = "Registration Successful";
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.get(
  "/get-visitors",
  // verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop });
      const visitors = await SessionInfo.find({ merchantId: doc.id });

      const res = visitors.map((visitor) => ({
        name: visitor.ipInfo,
        timestamp: visitor.timestamp,
        source: visitor.osInfo,
        events: visitor.userActivity,
        browser: visitor.browser,
        totalVisits: visitors.filter((vis) => vis.ipInfo === visitor.ipInfo)
          .length,
        // recording: visitor.recording,
      }));

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 200;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-recording",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const { name } = ctx.request.query;

      const doc = await Merchant.findOne({ shop: shop });
      const visitor = await SessionInfo.findOne({
        merchantId: doc.id,
        ipInfo: name,
      });

      ctx.response.status = 200;
      ctx.response.body = visitor.recording;
    } catch (e) {
      ctx.response.status = 200;
      ctx.response.body = e;
    }
  }
);

router.get("/get-rec", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const { id } = ctx.request.query;
    console.log(id, "id");
    const doc = await Merchant.findOne({ shop: shop });
    console.log("310 ", doc);
    console.log(doc.id);
    let rec = await RecordingInfo.findOne({ recId: id });
    const data = await fs.readFileSync(`./recordings/${id}/${id}.txt`, "utf8");
    rec["recording"] = data;
    ctx.response.status = 200;
    ctx.response.body = rec;
  } catch (e) {
    console.log("in get-rec catch", e);
    ctx.response.status = 200;
    ctx.response.body = e;
  }
});

router.get("/local_get-rec", async (ctx) => {
  try {
    const { id } = ctx.request.query;
    // console.log(id, "id");
    // const doc = await Merchant.findOne({ shop: shop });
    // console.log("310 ", doc);
    // console.log(doc.id);
    let rec = await RecordingInfo.findOne({ recId: id });
    const data = await fs.readFileSync(`./recordings/${id}/${id}.txt`, "utf8");

    rec["recording"] = data;
    let data1 = JSON.parse(data);
    console.log(data1);
    ctx.response.status = 200;
    ctx.response.body = rec;
  } catch (e) {
    console.log("in get-rec catch", e);
    ctx.response.status = 200;
    ctx.response.body = e;
  }
});

router.get(
  "/get-analytics",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const doc = await Merchant.findOne({ shop: shop });
      const visitors = await SessionInfo.find({ merchantId: doc.id });

      const browser = {};
      const device = {};
      const page = {};
      const visitor = {};
      const location = {};

      const computeFrequency = (
        browserMap,
        deviceMap,
        pagesMap,
        visitorMap,
        loactionMap
      ) => {
        visitors.forEach((visitor) => {
          const { browser, osInfo, path, ipInfo } = visitor;

          if (browserMap[browser]) {
            browserMap[browser] += 1;
          } else {
            browserMap[browser] = 1;
          }

          if (deviceMap[osInfo]) {
            deviceMap[osInfo] += 1;
          } else {
            deviceMap[osInfo] = 1;
          }

          if (pagesMap[path]) {
            pagesMap[path] += 1;
          } else {
            pagesMap[path] = 1;
          }

          if (visitorMap[ipInfo]) {
            visitorMap[ipInfo] += 1;
          } else {
            visitorMap[ipInfo] = 1;
          }

          // const { location } = JSON.parse(ipInfo);

          // if(loactionMap[location]) {
          //   loactionMap[location] += 1;
          // } else {
          //   loactionMap[location] = 1;
          // }
        });
      };

      computeFrequency(browser, device, page, visitor, location);

      const res = {
        browser: browser,
        device: device,
        page: page,
        visitor: visitor,
        location: location,
      };

      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.put(
  "/update-settings",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();

      const update = (updateData) => {
        updateData.forEach(async (data) => {
          if (data.key) {
            await Merchant.findOneandUpdate(
              { shop: shop },
              { [data.key]: data.value }
            );
          }
        });
      };

      const {
        analytics,
        loading,
        email,
        extreme,
        controls,
        record,
        scrambleText,
        blocked,
      } = ctx.request.body;

      update([
        { key: "analytics", value: analytics },
        { key: "loading", value: loading },
        { key: "email", value: email },
        { key: "extreme", value: extreme },
        { key: "controls", value: controls },
        { key: "record", value: record },
        { key: "scrambleText", value: scrambleText },
        { key: "blocked", value: blocked },
      ]);
      ctx.response.status = 200;
      ctx.response.body = "Update Successful";
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.get(
  "/get-shop-name",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      ctx.response.status = 200;
      ctx.response.body = shop;
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.body = err;
    }
  }
);

router.get(
  "/read-instruction",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      //const shop = getName();
      //const testShop = ctx.query.shop;
      // console.log(shop,"shopyyyyyyyyyyyyyyyyyyyyyy" );
      //  const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const shop = getName();
      console.log(shop, "store/read-instruction, shop name ");
      const doc = await Merchant.findOne({ shop: shop });
      console.log(doc, "store/read-instruction,doc  ");
      ctx.response.body = { readInst: doc?.read_instructions };
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);
router.post(
  "/read-instruction",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const shop = getName();
      let doc = await Merchant.findOne({ shop: shop });
      doc.read_instructions = true;
      const new_doc = await doc.save();
      ctx.response.status = 200;
      ctx.response.body = new_doc;
      console.log(new_doc, "153");
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

export default router;
