import SessionInfo from "../models/sessionInfo";
import Membership from "../models/membership";
import Merchant from "../models/merchant";
import Shopify from "@shopify/shopify-api";

export async function checkPlan(ctx, next) {
  try {
    const shop = ctx.request.query.shop;

    const doc = await Merchant.findOne({
      shop,
    });

    const plan = await Membership.findOne({ merchant_id: doc.id });

    const sessions = await SessionInfo.find({
      merchantId: doc.id,
    });

    var total_visits = 0;
    sessions.forEach((s) => {
      total_visits += s.pgurl.length;
    });

    console.log("Middleware", total_visits, plan.max_page_views);

    if (total_visits > plan.max_page_views) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: "Your plan is expired. Please upgrade your plan",
      };
    } else {
      return next();
    }

    // ctx.response.status = 400;
    // ctx.response.body = {
    //   success : false,
    //   message : 'Your plan is expired. Please upgrade your plan'
    // }
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: error.message,
    };
  }
}
