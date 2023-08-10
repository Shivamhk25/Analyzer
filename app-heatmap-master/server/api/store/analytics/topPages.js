import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com
//verifyRequest({ returnHeader: true }),
router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // const shop = "deepak-daphnis92.myshopify.com"
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

    // console.log(sessions1, "sessionssssssssssssssssss");
    const mostFrequent = (data) =>
      data.reduce(
        (r, c, i, a) => {
          r[c] = (r[c] || 0) + 1;
          r.max = r[c] > r.max ? r[c] : r.max;
          if (i == a.length - 1) {
            r = Object.entries(r).filter(([k, v]) => v == r.max && k != "max");
            return r.map((x) => x[0]);
          }
          return r;
        },
        { max: 0 }
      );

    // let pages = sessions1.map((session) => session.path);
    sessions1.forEach((session) => {
      let removedURL = 0;
      if (mostFrequent(session.pgurl)[0].split("/")[0] === "https:") {
        removedURL = mostFrequent(session.pgurl)[0].split("/")[2].length + 8; //8 is length of "https://"
      } else if (mostFrequent(session.pgurl)[0].split("/")[0] === "http:") {
        removedURL = mostFrequent(session.pgurl)[0].split("/")[2].length + 7; //7 is length of "http://"
      }
      session.path = mostFrequent(session.pgurl)[0].slice(removedURL);
    });
    let pages = sessions1.map((session) => session.path.split("?")[0]);
    pages = [...new Set(pages)];
    // console.log(pages);

    let total_visits = 0,
      total_time = 0;
    let data = [];
    let total_Unique_users = 0;
    let count = 0;
    pages.forEach((page) => {
      // console.log(page);
      let pageData = {
        name: page,
        total_visits: 0,
        total_time: 0,
        country_code: "in",
      };
      let locations = {},
        devices = {};
      let browsers = {};
      const users = new Set();
      let max_location = { count: 0, location: "null" };
      let max_devices = { count: 0, device: "null" };
      let max_browser = { count: 0, browser: "null" };
      // let count = 0;

      sessions.forEach((session) => {
        // console.log(session);
        if (session.path === page) {
          if (session.recording && session.recording.length !== 0) {
            if (
              session.recording[0].endTime &&
              session.recording[0].startTime
            ) {
              pageData.total_time +=
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
          pageData.total_visits += 1;
          users.add(session.ipInfo);
          if (locations[session.location] === undefined) {
            locations[session.location] = 1;
          } else {
            locations[session.location] += 1;
          }
          pageData.country_code = session.countryCode;
          if (browsers[session.browser] === undefined) {
            browsers[session.browser] = 1;
          } else {
            browsers[session.browser] += 1;
          }

          if (devices[session.osInfo] === undefined) {
            devices[session.osInfo] = 1;
          } else {
            devices[session.osInfo] += 1;
          }
        }
      });
      total_time += pageData.total_time;
      total_visits += pageData.total_visits;
      pageData.unique_users = users.size;
      total_Unique_users += users.size;
      // pageData.repeated_users =
      //   (100 * (pageData.total_visits - users.size)) / pageData.total_visits;

      Object.keys(locations).forEach((key) => {
        if (locations[key] > max_location.count) {
          max_location.location = key;
          max_location.count = locations[key];
        }
      });
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
      pageData.location = max_location.location;
      pageData.device = max_devices.device;
      pageData.browser = max_browser.browser;
      data.push(pageData);
    });

    data.forEach((pageData) => {
      if (pageData.total_time && count !== 0) {
        pageData.avg_time = Math.round(pageData.total_time / count);
      } else {
        pageData.avg_time = 0;
      }
      pageData.total_visits = (100 * pageData.total_visits) / total_visits;
      pageData.unique_users =
        (pageData.unique_users / total_Unique_users) * 100;
    });

    data.sort(function (a, b) {
      return b.total_visits - a.total_visits;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
