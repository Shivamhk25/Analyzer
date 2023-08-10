import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";

import MostRepeatVisitors from "./mostRepeatVisitors";
import HighestConversionUser from "./highestConversionValue";
import TopBrowsers from "./topBrowsers";
import TopDevices from "./topDevices";
import TopLocations from "./topLocations";
import TopPages from "./topPages";
import IconConfig from "./iconsConfig";
import TopPuchasers from "./topPurchases";
import TopIps from "./topIPAddress";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com

router.use("/most-repeat-visitors", MostRepeatVisitors.routes());
router.use("/high-conversion-value-users", HighestConversionUser.routes());
router.use("/top-browsers", TopBrowsers.routes());
router.use("/top-devices", TopDevices.routes());
router.use("/top-locations", TopLocations.routes());
router.use("/top-pages", TopPages.routes());
router.use("/data", IconConfig.routes());
router.use("/top-purchasers", TopPuchasers.routes());
router.use("/top-ips", TopIps.routes());

// const shop = "pranay-devstore.myshopify.com";
//
router.post(
  "/most-visits-no-purchase",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // const shop = "deepakdaphnis11.myshopify.com";
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

      // let sessions1 = sessions.filter((session) => {
      //   console.log(session?.created?.getTime(), "sessrreeeeeeeeererrs");
      //   return (
      //     session?.created?.getTime() >= start &&
      //     session?.created?.getTime() <= end
      //   );
      // });

      // console.log(sessions1, "sessionssssssssssssssssss");

      let unique_ip = [...new Set(sessions.map((session) => session.ipInfo))];

      let unique_mvnp = new Map();

      unique_ip.forEach((ip) => {
        sessions.forEach((session) => {
          if (session.ipInfo === ip && unique_mvnp.has(ip) === false) {
            unique_mvnp.set(ip, session);
          } else {
            let prevSession = unique_mvnp.get(ip);
            if (prevSession) {
              if (session.ipInfo === prevSession.ipInfo) {
                const newPgUrl = prevSession.pgurl.concat(session.pgurl);
                prevSession.pgurl = newPgUrl;
                unique_mvnp.set(ip, prevSession);
              }
            }
          }
        });
      });

      const newData = Object.fromEntries(unique_mvnp);
      let finalData = Object.values(newData);

      let data = [];
      let total_time = 0;
      let total_visits = 0;
      let count1 = 0;

      const mostFrequent = (data) =>
        data.reduce(
          (r, c, i, a) => {
            r[c] = (r[c] || 0) + 1;
            r.max = r[c] > r.max ? r[c] : r.max;
            if (i == a.length - 1) {
              r = Object.entries(r).filter(
                ([k, v]) => v == r.max && k != "max"
              );
              return r.map((x) => x[0]);
            }
            return r;
          },
          { max: 0 }
        );

      finalData.forEach((ele) => {
        let sessionData = {
          sessionId: ele.sessionId,
          total_visits: 0,
          total_time: 0,
          total_purchase_value: 0,
          isp: "Bharti Airtel",
          Ip_Info: "",
          Created_at: Date.now(),
          location: "",
          country_code: "in",
          // landing_page: "",
          most_visited: "",
          pages: 2,
          tags: "Click to Tag",
          activity: "",
          // edit_page: "",
        };
        let devices = {};
        let max_devices = { count: 0, device: "null" };
        // let count1 = 0;
        sessions.forEach((session) => {
          if (session.sessionId === ele.sessionId) {
            let count = 0;
            session.pgurl.forEach((element) => {
              if (element.includes("/thank_you/")) {
                count += 1;
              }
            });

            if (session.recording && session.recording.length !== 0) {
              if (
                session.recording[0].endTime &&
                session.recording[0].startTime
              ) {
                sessionData.total_time +=
                  session.recording[0].endTime - session.recording[0].startTime;
                count1 += 1;
                console.log(
                  Math.round(
                    (session.recording[0].endTime -
                      session.recording[0].startTime) /
                      1000
                  )
                );
              }
            }
            sessionData.total_visits += 1;
            sessionData.total_purchase_value += count;
            sessionData.country_code = session.countryCode;
            sessionData.isp = session.isp;
            sessionData.pages = session.pgurl.length;
            if (session.recording && session.recording.length !== 0) {
              sessionData.sessionId = session.recording[0].recId;
              sessionData.activity = session.recording[0].timeDuration;
            }
            if (devices[session.osInfo] == undefined) {
              devices[session.osInfo] = 1;
            } else {
              devices[session.osInfo] += 1;
            }
            sessionData.Ip_Info = session.ipInfo;
            sessionData.location = session.location;
            if (session.pgurl.length !== 0) {
              // sessionData.landing_page = session.pgurl[0].replace(
              //   `https://${shop}`,
              //   ""
              // );
              // sessionData.edit_page = session.pgurl[
              //   session.pgurl.length - 1
              // ].replace(`https://${shop}`, "");
              let removedURL = 0;
              if (mostFrequent(session.pgurl)[0].split("/")[0] === "https:") {
                removedURL =
                  mostFrequent(session.pgurl)[0].split("/")[2].length + 8; //8 is length of "https://"
              } else if (
                mostFrequent(session.pgurl)[0].split("/")[0] === "http:"
              ) {
                removedURL =
                  mostFrequent(session.pgurl)[0].split("/")[2].length + 7; //7 is length of "http://"
              }
              sessionData.most_visited = mostFrequent(session.pgurl)[0]
                .slice(removedURL)
                .split("?")[0];
            }
          }
        });
        total_time += sessionData.total_time;
        Object.keys(devices).forEach((key) => {
          if (devices[key] > max_devices.count) {
            max_devices.device = key;
            max_devices.count = devices[key];
          }
        });
        sessionData.device = max_devices.device;
        data.push(sessionData);
      });

      data.forEach((fData) => {
        let number_of_records = 0;
        sessions.forEach(async (session) => {
          if (fData.Ip_Info === session.ipInfo) number_of_records += 1;
        });
        fData.total_visits = number_of_records;
      });

      data.forEach((dt) => {
        sessions.forEach((session) => {
          if (dt.Ip_Info === session.ipInfo)
            dt.avg_time = Math.round(dt.total_time / count1);
        });
      });

      // data = data.filter(
      //   (sessionData) => sessionData.total_purchase_value === 0
      // );

      data.sort((a, b) => {
        return b.total_visits - a.total_visits;
      });

      data = data.filter(
        (sessionData) => sessionData.total_purchase_value === 0
      );
      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
      console.log(e);
    }
  }
);

router.post("/local/most-visits-no-purchase", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
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
      console.log(session?.created?.getTime(), "sessrreeeeeeeeererrs");
      return (
        session?.created?.getTime() >= start &&
        session?.created?.getTime() <= end
      );
    });

    console.log(sessions1, "sessionssssssssssssssssss");

    let sessionIds = sessions1.map((session) => session.sessionId);
    sessionIds = [...new Set(sessionIds)];

    let total_time = 0;
    let data = [];
    let count1 = 0;

    sessionIds.forEach((sessionId) => {
      let sessionData = {
        sessionId: sessionId,
        total_visits: 0,
        total_time: 0,
        total_purchase_value: 0,
        isp: "Bharti Airtel",
        Ip_Info: "",
        Created_at: Date.now(),
        location: "",
        landing_page: "",
        tags: "Click to Tag",
        activity: "",
        exit_page: "",
      };
      let devices = {};
      let max_devices = { count: 0, device: "null" };

      sessions1.forEach((session) => {
        if (session.sessionId === sessionId) {
          let count = 0;
          session.pgurl.find((element) => {
            if (element.includes("/thank_you/")) {
              count++;
            }
          });

          if (session.recording && session.recording.length !== 0) {
            if (
              session.recording[0].endTime &&
              session.recording[0].startTime
            ) {
              sessionData.total_time +=
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
          sessionData.total_visits += 1;
          sessionData.isp = session.isp;
          sessionData.total_purchase_value += count;
          if (devices[session.osInfo] == undefined) {
            devices[session.osInfo] = 1;
          } else {
            devices[session.osInfo] += 1;
          }
          sessionData.Ip_Info = session.ipInfo;
          sessionData.location = session.location;
          if (session.pgurl.length !== 0) {
            sessionData.landing_page = session.pgurl[0];
            sessionData.exit_page = session.pgurl[session.pgurl.length - 1];
          }
        }
      });
      total_time += sessionData.total_time;
      Object.keys(devices).forEach((key) => {
        if (devices[key] > max_devices.count) {
          max_devices.device = key;
          max_devices.count = devices[key];
        }
      });
      sessionData.device = max_devices.device;
      data.push(sessionData);
    });

    data.forEach((sessionData) => {
      sessionData.avg_time = Math.round(sessionData.total_time / count1);
    });

    data = data.filter((sessionData) => sessionData.total_purchase_value === 0);
    data.sort((a, b) => {
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

router.post(
  "/most-cart-value",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      //const shop = "first-app25.myshopify.com"
      const doc = await Merchant.findOne({
        shop,
      });

      const { start, end } = ctx.request.body;
      console.log(start, "sessrreeeeeeeeererrs", end);
      let sessions = await SessionInfo.find({ merchantId: doc.id });
      const blocked = await BlockedIp.find({ merchantId: doc.id });

      blocked.forEach((ip) => {
        sessions.forEach(function (session, index, object) {
          if (ip.ipAddress === session.ipInfo) object.splice(index, 1);
        });
      });

      let sessions1 = sessions.filter((session) => {
        console.log(session?.created?.getTime(), "sessrreeeeeeeeererrs");
        return (
          session?.created?.getTime() >= start &&
          session?.created?.getTime() <= end
        );
      });

      console.log(sessions1, "sessionssssssssssssssssss");

      let sessionIds = sessions1.map((session) => session.sessionId);
      sessionIds = [...new Set(sessionIds)];

      let total_time = 0;
      let data = [];
      let count1 = 0;

      sessionIds.forEach((sessionId) => {
        let sessionData = {
          sessionId: sessionId,
          total_visits: 0,
          total_time: 0,
          total_cart_value: 0,
          isp: "Bharti Airtel",
          Ip_Info: "",
          Created_at: Date.now(),
          location: "",
          landing_page: "",
          tags: "Click to Tag",
          activity: "",
          exit_page: "",
        };
        let devices = {};
        let max_devices = { count: 0, device: "null" };
        // let count1 = 0;
        sessions1.forEach((session) => {
          if (session.sessionId === sessionId) {
            if (session.recording && session.recording.length !== 0) {
              if (
                session.recording[0].endTime &&
                session.recording[0].startTime
              ) {
                sessionData.total_time +=
                  session.recording[0].endTime - session.recording[0].startTime;
                count1 += 1;
                console.log(
                  Math.round(
                    (session.recording[0].endTime -
                      session.recording[0].startTime) /
                      1000
                  )
                );
              }
            }
            sessionData.total_visits += 1;
            sessionData.total_cart_value += session.cartValue;
            if (devices[session.osInfo] === undefined) {
              devices[session.osInfo] = 1;
            } else {
              devices[session.osInfo] += 1;
            }
            sessionData.Ip_Info = session.ipInfo;
            sessionData.location = session.location;
            if (session.pgurl.length !== 0) {
              sessionData.landing_page = session.pgurl[0];
              sessionData.exit_page = session.pgurl[pgurl.length - 1];
            }
          }
        });
        total_time += sessionData.total_time;

        Object.keys(devices).forEach((key) => {
          if (devices[key] > max_devices.count) {
            max_devices.device = key;
            max_devices.count = devices[key];
          }
        });
        sessionData.device = max_devices.device;
        data.push(sessionData);
      });

      data.forEach((sessionData) => {
        sessionData.avg_time = Math.round(sessionData.total_time / count1);
      });

      data.sort((a, b) => {
        return a.total_cart_value > b.total_cart_value;
      });

      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);
// router.post(
//   "/",
//   verifyRequest({ returnHeader: true }),
//   async (ctx) => {
//     try {
//       const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
//       const doc = await Merchant.findOne({
//         shop: satyakidevstore.myshopify.com,
//       });

//       ctx.response.status = 200;
//       ctx.response.body = data;
//     } catch (e) {
//       ctx.response.status = 400;
//       ctx.response.body = e;
//     }
//   }
// );

export default router;
