import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import Membership from "../../../models/membership";
import Plans from "../../../config/plan";

const router = Router();

router.get("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    const membership = await Membership.findOne({ merchant_id: doc.id });
    if (membership) {
      ctx.response.status = 200;
      ctx.response.body = { membership, shop };
    } else {
      const newMembership = new Membership({
        merchant_id: doc.id,
        membership_plan: Plans["Free Plan"].name,
        max_page_views: Plans["Free Plan"].max_page_views,
        max_days_retention: Plans["Free Plan"].max_days_retention,
      });
      const savedData = await newMembership.save();
      ctx.response.status = 200;
      ctx.response.body = { savedData };
    }
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
router.get("/plans", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    ctx.response.status = 200;
    ctx.response.body = { Plans };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.get(
  "/current-plan",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res
      );
      const client = new Shopify.Clients.Rest(shop, accessToken);
      const doc = await Merchant.findOne({
        shop,
      });

      const res = await client.get({
        path: "recurring_application_charges",
      });

      console.log("recurring_charges", res.body.recurring_application_charges);

      const activeplan = res.body.recurring_application_charges.filter(
        ({ status }) => status === "active"
      );

      if (activeplan && activeplan.length > 0) {
        const doc = await Merchant.findOne({ shop });
        const membership = await Membership.findOneAndUpdate(
          { merchant_id: doc.id },
          {
            status: activeplan[0].status,
            membership_plan: activeplan[0].name,
            created: activeplan[0].created_at,
            updated: activeplan[0].updated_at,
            max_page_views: Plans[activeplan[0].name].max_page_views,
            max_days_retention: Plans[activeplan[0].name].max_days_retention,
          },
          {
            new: true,
            upsert: true,
          }
        );

        ctx.response.status = 200;
        ctx.response.body = { membership, shop };
      } else {
        ctx.response.status = 200;
        ctx.response.body = "Free Plan";
      }

      // const membership = await Membership.findOne({ merchant_id: doc.id });
      // if (membership) {
      //   ctx.response.status = 200;
      //   ctx.response.body = { membership, shop };
      // } else {
      //   ctx.response.status = 200;
      //   ctx.response.body = "Free Plan";
      // }
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

export default router;
