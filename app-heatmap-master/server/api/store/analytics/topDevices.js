import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com

router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    //const shop = "first-app25.myshopify.com"
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;
    let sessions = await SessionInfo.find({ merchantId: doc.id });
    const blocked = await BlockedIp.find({ merchantId: doc.id });

    blocked.forEach((ip) => {
      sessions.forEach(function (session, index, object) {
        if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
      });
    });

    let sessions1 = sessions.filter((session) => {
      //console.log(session?.created?.getTime(), "sessrreeeeeeeeererrs");
      return (
        session?.created?.getTime() >= start &&
        session?.created?.getTime() <= end
      );
    });

    console.log(sessions1, "sessionssssssssssssssssss");

    let devices = sessions1.map((session) => session.osInfo);
    devices = [...new Set(devices)];

    let total_time = 0;
    let total_users = 0;
    let total_Unique_users = 0;
    let data = [];

    let count = 0;
    devices.forEach((device) => {
      let deviceData = {
        name: device,
        total_time: 0,
        total_users: 0,
        unique_users: 0,
        country_code: "in",
      };
      let locations = {};
      let browsers = {};
      const users = new Set();
      let max_location = { count: 0, location: "null" };
      let max_browser = { count: 0, browser: "null" };

      sessions.forEach((session) => {
        console.log(session);
        if (session.osInfo === device) {
          if (session.recording && session.recording.length !== 0) {
            if (
              session.recording[0].endTime &&
              session.recording[0].startTime
            ) {
              deviceData.total_time +=
                session.recording[0].endTime - session.recording[0].startTime;
              count += 1;
              console.log(
                Math.round(
                  (session.recording[0].endTime -
                    session.recording[0].startTime) /
                    1000
                )
              );
            }
          }
          deviceData.total_users += 1;
          deviceData.country_code = session.countryCode;
          users.add(session.ipInfo);
          if (locations[session.location] === undefined) {
            locations[session.location] = 1;
          } else {
            locations[session.location] += 1;
          }
          if (browsers[session.browser] === undefined) {
            browsers[session.browser] = 1;
          } else {
            browsers[session.browser] += 1;
          }
        }
      });
      total_time += deviceData.total_time;
      deviceData.unique_users = users.size;
      total_users += deviceData.total_users;
      total_Unique_users += users.size;

      Object.keys(locations).forEach((key) => {
        if (locations[key] > max_location.count) {
          max_location.location = key;
          max_location.count = locations[key];
        }
      });
      Object.keys(browsers).forEach((key) => {
        if (browsers[key] > max_browser.count) {
          max_browser.browser = key;
          max_browser.count = browsers[key];
        }
      });
      deviceData.location = max_location.location;
      deviceData.browser = max_browser.browser;
      data.push(deviceData);
    });

    data.forEach((deviceData) => {
      deviceData.avg_time = Math.round(deviceData.total_time / count);
      deviceData.total_users = (deviceData.total_users / total_users) * 100;
      deviceData.unique_users =
        (deviceData.unique_users / total_Unique_users) * 100;
    });
    console.log(data, "71 top-devices");

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
