import Router from "koa-router";
import BlockedIp from "../../../models/blockedIPs";
import Merchant from "../../../models/merchant";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import SessionInfo from "../../../models/sessionInfo";

const router = Router();
// const shop = 'heatmap-testing001.myshopify.com';

router.get("/blockedIp", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({ shop: shop });
    const blocked = await BlockedIp.find({ merchantId: doc._id });
    ctx.response.status = 200;
    ctx.response.body = blocked;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post(
  "/blockedIp",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({ shop: shop });
      if (!ctx.request.body.ip) {
        ctx.response.status = 401;
        ctx.response.body = {
          success: false,
          message: "please provide ip address",
        };
        return ctx.response;
      }

      const { ip } = ctx.request.body;
      const found = await BlockedIp.findOne({
        merchantId: doc._id,
        ipAddress: ip,
      });

      if (found) {
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          error: false,
          message: "Given ip already blocked",
        };
        return ctx.response;
      }

      let AddedIp = new BlockedIp({
        merchantId: doc.id,
        ipAddress: ip,
      });
      await SessionInfo.updateMany(
        { ipInfo: ip },
        { $set: { isBlockIp: true } }
      );
      await AddedIp.save();
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        error: false,
        message: "provided ip has been added",
        IpAdded: AddedIp,
      };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.delete(
  "/blockedIp",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    console.log(ctx.request.body, "59", ctx.request);
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({ shop: shop });
      if (!ctx.request.body.ip) {
        ctx.response.status = 401;
        ctx.response.body = {
          success: false,
          message: "please provide ip address",
        };
        return ctx.response;
      }

      const { ip } = ctx.request.body;
      const found = await BlockedIp.findOneAndDelete({
        merchantId: doc._id,
        ipAddress: ip,
      });

      await SessionInfo.updateMany(
        { ipInfo: ip },
        { $set: { isBlockIp: false } }
      );

      if (!found) {
        ctx.response.status = 403;
        ctx.response.body = {
          success: false,
          error: true,
          message: `given ip ${ip} is not valid`,
        };
        return ctx.response;
      }

      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        error: false,
        message: `given ip ${ip} has been deleted`,
      };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

export default router;
