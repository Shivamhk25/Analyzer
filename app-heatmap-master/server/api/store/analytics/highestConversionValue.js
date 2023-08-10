import SessionInfo from "../../../models/sessionInfo";
import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Merchant from "../../../models/merchant";
import RecordingInfo from "../../../models/recording";

const router = Router();
// const shop = "pranay-devstore.myshopify.com";
router.post(
  "/",
  verifyRequest({ returnHeader: true }),

  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({
        shop,
      });
      // const doc = await Merchant.findOne({
      //   shop: "pranay-devstore.myshopify.com",
      // });

      // const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const recording = await RecordingInfo.find({ merchantId: doc.id });
      console.log(recording);

      //   const client = new Shopify.Clients.Rest(shop, accessToken);
      //   const data = await client.get({
      //     path: 'orders',
      //     query: {"status":"any"},
      //   });
      //   console.log(data);

      // console.log(doc);
      // let data = [
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      //   {
      //     visitor: "Bharti Airtel",
      //     ipAdress: "106.215.225.30",
      //     CreatedAt: new Date(),
      //     pages: 2,
      //     timeDuration: "2 min",
      //     landingPage: "Collection/30",
      //     location: "Surat, Gujrat",
      //   },
      // ];

      ctx.response.status = 200;
      ctx.response.body = recording;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

export default router;
