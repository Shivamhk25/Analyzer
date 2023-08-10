import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com
// verifyRequest({ returnHeader: true }),
//
router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    //const shop = "first-app25.myshopify.com"
    // const shop = "sekhharrstore.myshopify.com";
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
    let locations = sessions1.map((session) => session.location);
    locations = [...new Set(locations)];

    let total_visits = 0;
    let total_time = 0;
    let data = [];
    let total_Unique_users = 0;
    let count = 0;

    locations.forEach((location) => {
      let locationData = {
        name: location,
        total_visits: 0,
        total_time: 0,
        unique_users: 0,
        country_code: "in",
      };

      let devices = {};
      let browsers = {};
      const users = new Set();
      let max_devices = { count: 0, device: "null" };
      let max_browser = { count: 0, browser: "null" };

      sessions1.forEach((session) => {
        if (session.location === location) {
          if (session.recording && session.recording.length !== 0) {
            if (
              session.recording[0].endTime &&
              session.recording[0].startTime
            ) {
              locationData.total_time +=
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
          locationData.total_visits += 1;
          locationData.country_code = session.countryCode;
          users.add(session.ipInfo);
          if (devices[session.osInfo] === undefined) {
            devices[session.osInfo] = 1;
          } else {
            devices[session.osInfo] += 1;
          }
          if (browsers[session.browser] === undefined) {
            browsers[session.browser] = 1;
          } else {
            browsers[session.browser] += 1;
          }
        }
      });
      total_time += locationData.total_time;
      total_visits += locationData.total_visits;
      locationData.unique_users = users.size;
      total_Unique_users += users.size;
      // locationData.repeated_users =
      //   (100 * (locationData.total_visits - users.size)) /
      //   locationData.total_visits;
      Object.keys(devices).forEach((key) => {
        if (devices[key] > max_devices.count) {
          max_devices.device = key;
          max_devices.count = devices[key];
        }
      });
      Object.keys(browsers).forEach((key) => {
        if (browsers[key] > max_browser.count) {
          max_browser.browser = key;
          max_browser.count = browsers[key];
        }
      });
      locationData.device = max_devices.device;
      locationData.browser = max_browser.browser;
      data.push(locationData);
    });
    console.log(count, "count");
    data.forEach((locationData) => {
      if (locationData.total_time === 0) {
        locationData.avg_time = 0;
      } else {
        locationData.avg_time = Math.round(locationData.total_time / count);
        console.log(locationData.total_time, "locationData.total_time");
      }

      locationData.total_visits =
        (locationData.total_visits / total_visits) * 100;
      locationData.unique_users =
        (locationData.unique_users / total_Unique_users) * 100;
      // delete locationData.total_time;
      //  delete locationData.repeated_users;
      // delete locationData.total_visits;
    });

    // data.sort(function (a, b) {
    //   var keyA = a.total_users;
    //   var keyB = b.total_users;
    //   if (keyA < keyB) return -1;
    //   if (keyA > keyB) return 1;
    //   return 0;
    // });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
    console.log(e);
  }
});

export default router;
