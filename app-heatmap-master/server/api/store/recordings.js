import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Merchant from "../../models/merchant";
import Recording from "../../models/recordingInfo";
import SessionInfo from "../../models/sessionInfo";
import BlockedIp from "../../models/blockedIPs";
// import RecordingInfo from "../../models/recording";

const router = Router();
router.get("/", async (ctx) => {
  try {
    const { start, end } = ctx.request.query;
    console.log(start, end);
    console.log("start and end received");
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // const shop ="deepakdaphnis11.myshopify.com"
    // const shop = "appsizetest.myshopify.com";
    const doc = await Merchant.findOne({
      shop: shop,
    });

    let sessions = await SessionInfo.findOne({ merchantId: doc.id });
    const blocked = await BlockedIp.find({ merchantId: doc.id });

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });

    var record;

    if (start && end) {
      var priorDate = new Date(parseInt(start));
      var nowDate = new Date(parseInt(end));

      console.log(nowDate, priorDate);
      priorDate = priorDate.toLocaleDateString(`fr-CA`).split("/").join("-");
      nowDate = nowDate.toLocaleDateString(`fr-CA`).split("/").join("-");
      record = await Recording.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}T00:00:00.000Z`,
          $lt: `${nowDate}T23:59:59.999Z`,
        },
      }).sort({ created: -1 });
    } else {
      record = await Recording.find({
        merchantId: doc.id,
      }).sort({ created: -1 });
    }

    const data = {
      record,
      sessions,
    };
    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "hello";
  }
});

router.post("/local", async (ctx) => {
  try {
    const { start, end } = ctx.request.body;
    const { shop } = ctx.request.query;
    // var startdate, enddate;

    // if (start) startdate = new Date(start);
    // if (end) enddate = new Date(end);
    // //const shop = "first-app25.myshopify.com"
    const doc = await Merchant.findOne({
      shop: shop,
    });

    let sessions = await SessionInfo.findOne({ merchantId: doc.id });
    const blocked = await BlockedIp.find({ merchantId: doc.id });

    console.log(sessions);

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });

    var record;

    if (start && end) {
      var priorDate = new Date(start);
      var nowDate = new Date(end);

      priorDate = priorDate.toLocaleDateString(`fr-CA`).split("/").join("-");
      nowDate = nowDate.toLocaleDateString(`fr-CA`).split("/").join("-");
      record = await Recording.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}T00:00:00.000Z`,
          $lt: `${nowDate}T23:59:59.999Z`,
        },
      });
    } else {
      record = await Recording.find({
        merchantId: doc.id,
      });
    }

    const data = {
      record,
      sessions,
    };

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "hello";
  }
});

// router.post(
//   "/",
//   // verifyRequest({ returnHeader: true }),
//   async (ctx) => {
//     try {
//       // const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
//       const doc = await Merchant.findOne({
//         shop: "pranay-devstore.myshopify.com",
//       });
//       const record = new RecordingInfo({
//         merchantId: doc.id,
//         recId: "125zz",
//       });
//       await record.save();
//       console.log("inside recording post");
//       ctx.response.status = 200;
//       ctx.response.body = record;
//     } catch (e) {
//       ctx.response.status = 400;
//       ctx.response.body = e;
//     }
//   }
// );

// router.delete("/", async (ctx) =>{
//   try {
//     const records = await RecordingInfo.find();
//     records.forEach( async (record) => {
//       if(record.recId!== "1234zz")
//         await RecordingInfo.findOneAndDelete({recId:record.recId});
//     })
//     ctx.response.status = 200;
//     ctx.response.body = "deleted"
//   } catch (e) {
//     ctx.response.status = 400;
//     ctx.response.body = e;
//   }
// })

export default router;
