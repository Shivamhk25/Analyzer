import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();

router.get("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.query;
    let sessions = await SessionInfo.find({ merchantId: doc.id });
    const blocked = await BlockedIp.find({ merchantId: doc.id });

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });

    if (start)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() >= start
      );
    if (end)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() <= end
      );

    let ipAddresses = sessions.map((session) => session.ipInfo);
    ipAddresses = [...new Set(ipAddresses)];

    let data = [];

    ipAddresses.forEach((ipAddress) => {
      let ipData = {
        name: ipAddress,
        total_visits: 0,
        isp: "",
        Ip_Info: "",
        location: "",
        country_code: 91,
        landing_page: "",
        tags: "",
        browser: "",
        activity: "",
        edit_page: "",
      };

      sessions.forEach((session) => {
        if (session.ipInfo === ipAddress) {
          ipData.total_visits += 1;
          ipData.Ip_Info = session.ipInfo;
          ipData.isp = session.isp;
          ipData.landing_page = session.path;
          ipData.browser = session.browser;
          ipData.activity = session.userActivity;
          ipData.location = session.location;
          ipData.country_code = session.country_code;
        }
      });

      data.push(ipData);
    });

    data.sort((a, b) => {
      return b.total_visits - a.total_visits;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
