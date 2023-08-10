import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com
//
router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // console.log("##")
    // const shop = "deepak-daphnis92.myshopify.com"
    // const shop = "sekhharrstore.myshopify.com"

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

    sessions = sessions.filter((session) => {
      //console.log(session?.created?.getTime(), "sessrreeeeeeeeererrs");
      return (
        session?.created?.getTime() >= start &&
        session?.created?.getTime() <= end
      );
    });

    console.log(sessions, "sessionssssssssssssssssss");
    let browsers = sessions.map((session) => session.browser);
    console.log(browsers, "browserssssssssssssss");
    browsers = [...new Set(browsers)];

    let total_visits = 0;
    let total_Unique_users = 0;
    let total_time = 0;
    let data = [];

    // let total_individual_count = new Map;
    let count = 0;
    browsers.forEach((browser) => {
      let browserData = {
        name: browser,
        total_visits: 0,
        total_time: 0,
        unique_users: 0,
        country_code: "in",
      };
      let locations = {};
      let devices = {};
      const users = new Set();
      let max_location = { count: 0, location: "null" };
      let max_devices = { count: 0, device: "null" };
      sessions.forEach((session) => {
        if (session.browser === browser) {
          if (session.recording && session.recording.length !== 0) {
            if (
              session.recording[0].endTime &&
              session.recording[0].startTime
            ) {
              browserData.total_time +=
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
          browserData.total_visits += 1;
          browserData.country_code = session.countryCode;
          users.add(session.ipInfo);
          if (locations[session.location] === undefined) {
            locations[session.location] = 1;
          } else {
            locations[session.location] += 1;
          }
          if (devices[session.osInfo] == undefined) {
            devices[session.osInfo] = 1;
          } else {
            devices[session.osInfo] += 1;
          }
        }
      });

      total_time += browserData.total_time;
      // if(total_individual_count.has(browser))
      // total_individual_count.set(browser, total_individual_count[browser] + 1);
      // else{
      //   total_individual_count.set(browser, 1);
      // }

      total_visits += browserData.total_visits;
      browserData.unique_users = users.size;
      total_Unique_users += users.size;
      // browserData.repeated_users =
      //   (100 * (browserData.total_visits - users.size)) /
      //   browserData.total_visits;

      Object.keys(locations).forEach((key) => {
        console.log(key);
        if (locations[key] > max_location.count) {
          max_location.location = key;
          max_location.count = locations[key];
        }
      });
      Object.keys(devices).forEach((key) => {
        console.log(key);
        if (devices[key] > max_devices.count) {
          max_devices.device = key;
          max_devices.count = devices[key];
        }
      });
      browserData.location = max_location.location;
      browserData.device = max_devices.device;
      data.push(browserData);
      console.log(browserData, "browserssssssssssssss");
    });
    console.log(count, "count");
    data.forEach((browserData) => {
      browserData.avg_time = Math.round(browserData.total_time / count);
      browserData.total_visits =
        (browserData.total_visits / total_visits) * 100;
      browserData.unique_users = Math.round(
        (browserData.unique_users / total_Unique_users) * 100 * 100
      );
      browserData.unique_users = browserData.unique_users / 100;
    });

    console.log(data, "as a res");
    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;

/*
response from this route
[
  {
┃     name: 'Chrome',
┃     total_visits: 1,
┃     total_time: 1489249279,
┃     unique_users: 1,
┃     repeated_users: 0,
┃     location: undefined,
┃     device: undefined,
┃     avg_time: 1
┃   }
]

*/
