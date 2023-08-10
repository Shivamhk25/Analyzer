import Router from "koa-router";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { DataType } from "@shopify/shopify-api";

import Merchant from "../../../models/merchant";
import Membership from "../../../models/membership";
import plans from "../../../config/plan";
import axios from "axios";

const router = Router();

router.get(
  "/heatmap/recurring-application-charge",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res
      );
      const doc = await Merchant.findOne({ shop });
      const { charge_id } = ctx.request.query;
      console.log(charge_id, accessToken);
      const client = new Shopify.Clients.Rest(shop, accessToken);
      const res = await client.get({
        path: "recurring_application_charges/" + charge_id,
      });
      console.log("Response Res", res);

      const abc = await Membership.findOneAndUpdate(
        { merchant_id: doc.id },
        {
          status: res.body.recurring_application_charge.status,
          membership_plan: res.body.recurring_application_charge.name,
          created: res.body.recurring_application_charge.created_at,
          updated: res.body.recurring_application_charge.updated_at,
          max_page_views:
            plans[res.body.recurring_application_charge.name].max_page_views,
          max_days_retention:
            plans[res.body.recurring_application_charge.name]
              .max_days_retention,
        },
        {
          new: true,
          upsert: true,
        }
      );

      console.log(abc, "from abc");
      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post(
  "/heatmap/recurring-application-charge",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res
      );
      const { data } = ctx.request.body;

      const client = new Shopify.Clients.Rest(shop, accessToken);
      console.log(data);

      if (data.recurring_application_charge.name === "Free Plan") {
        const res = await client.get({
          path: "recurring_application_charges",
        });

        const activeplan = res.body.recurring_application_charges.filter(
          ({ status }) => status === "active"
        );

        if (activeplan && activeplan.length > 0) {
          const doc = await Merchant.findOne({
            shop,
          });

          await Membership.findOneAndUpdate(
            { merchant_id: doc.id },
            {
              status: "active",
              membership_plan: "Free Plan",
              max_page_views: 500,
              max_days_retention: 30,
            },
            {
              new: true,
              upsert: true,
            }
          );

          await client.delete({
            path: `recurring_application_charges/${activeplan[0].id}`,
          });

          ctx.response.status = 200;
          ctx.response.body = {
            success: true,
            msg: "Done",
          };
        } else {
          ctx.response.status = 400;
          ctx.response.body = {
            success: false,
            msg: "Already on free plan",
          };
        }
      }

      const res = await client.post({
        path: "recurring_application_charges",
        data: data,
        type: DataType.JSON,
      });

      console.log(res, "from post recuring charge");
      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

export default router;
