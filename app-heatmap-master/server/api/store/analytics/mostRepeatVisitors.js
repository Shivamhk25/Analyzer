import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
var parser = require("parse-whois");
var whois = require("node-whois");
var ipInfo = require("ip-info-finder");

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";
import { map } from "country-flags-svg/dist/data/countries";

const router = Router();
// satyakidevstore.myshopify.com

function ValidateIPaddress(ipaddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
}
//
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
    console.log(sessions[0].created.getTime());
    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    // let sessionIds = sessions.map((session) => session.sessionId);
    // sessionIds = [...new Set(sessionIds)];
    // console.log("most repeaters");
    // console.log(sessionIds);

    // let total_visits = 0,
    //   total_time = 0;
    // let data = [];

    // sessionIds.forEach((sessionId) => {
    //   let sessionData = {
    //     sessionId: sessionId,
    //     total_visits: 0,
    //     total_time: 0,
    //     isp: "Bharti Airtel",
    //     Ip_Info: "192.68.2.9",
    //     country_code: "in",
    //     location: "Delhi",
    //     countryCode: 91,
    //     pages: 2,
    //     landing_page: "",
    //     edit_page: "",
    //     Created_at: "",
    //     tags: "Click to Tag",
    //     activity: "",
    //   };
    //   let devices = {};
    //   let max_devices = { count: 0 };

    //   sessions.forEach(async (session) => {
    //     if (session.sessionId === sessionId) {
    //       sessionData.total_time +=
    //         session?.updated?.getTime() - session?.created?.getTime();
    //       sessionData.total_visits += 1;
    //       sessionData.Ip_Info = session.ipInfo;
    //       sessionData.isp = session.isp;
    //       sessionData.location = session.location;
    //       sessionData.pages = session.pgurl.length;
    //       sessionData.country_code = session.countryCode;
    //       if (session.recording && session.recording.length !== 0) {
    //         sessionData.sessionId = session.recording[0].recId;
    //         sessionData.activity = session.recording[0].timeDuration;
    //       }
    //       if (session.pgurl.length !== 0) {
    //         sessionData.landing_page = session.pgurl[0].replace(
    //           `https://${shop}`,
    //           ""
    //         );
    //         sessionData.edit_page = session.pgurl[
    //           session.pgurl.length - 1
    //         ].replace(`https://${shop}`, "");
    //       }
    //       sessionData.countryCode = session.countryCode;
    //       sessionData.Created_at = session?.created?.getTime();
    //       devices[session.osInfo] += 1;
    //       console.log(session.recording);
    //     }
    //   });

    //   total_time += sessionData.total_time;
    //   total_visits += sessionData.total_visits;

    //   Object.keys(devices).forEach((key) => {
    //     if (devices[key] > max_devices.count) {
    //       max_devices.device = key;
    //       max_devices.count = devices[key];
    //     }
    //   });

    //   sessionData.device = max_devices.device;
    //   data.push(sessionData);
    // });

    // data.forEach((sessionData) => {
    //   sessionData.total_visits = sessionData.total_visits / total_visits;
    //   sessionData.avg_time = sessionData.total_time / total_time;
    // });

    sessions.sort(function (a, b) {
      return b.created.getTime() - a.created.getTime();
    });

    let unique_ip = [...new Set(sessions.map((session) => session.ipInfo))];

    let unique_mvp = new Map();

    unique_ip.forEach((ip) => {
      sessions.forEach((session) => {
        if (session.ipInfo === ip && unique_mvp.has(ip) === false) {
          unique_mvp.set(ip, session);
        } else {
          let prevSession = unique_mvp.get(ip);
          if (prevSession) {
            if (session.ipInfo === prevSession.ipInfo) {
              const newPgUrl = prevSession.pgurl.concat(session.pgurl);
              prevSession.pgurl = newPgUrl;
              unique_mvp.set(ip, prevSession);
            }
          }
        }
      });
    });
    // console.log('Map' , unique_mvp)
    // console.log("unique ip", unique_ip)

    // unique_mvp.forEach((session, key) => {
    //   let sessionData = {
    //     sessionId: "",
    //     total_visits: 0,
    //     total_time: 0,
    //     isp: "Bharti Airtel",
    //     Ip_Info: "192.68.2.9",
    //     country_code: "in",
    //     location: "Delhi",
    //     countryCode: 91,
    //     pages: 2,
    //     landing_page: "",
    //     edit_page: "",
    //     Created_at: "",
    //     tags: "Click to Tag",
    //     activity: "",
    //   };

    //   sessionData.total_time +=
    //     session?.updated?.getTime() - session?.created?.getTime();
    //   sessionData.total_visits += 1;
    //   sessionData.Ip_Info = session.ipInfo;
    //   sessionData.isp = session.isp;
    //   sessionData.location = session.location;
    //   sessionData.pages = session.pgurl.length;
    //   sessionData.country_code = session.countryCode;
    //   if (session.recording && session.recording.length !== 0) {
    //     sessionData.sessionId = session.recording[0].recId;
    //     sessionData.activity = session.recording[0].timeDuration;
    //   }
    //   if (session.pgurl.length !== 0) {
    //     sessionData.landing_page = session.pgurl[0].replace(
    //       `https://${shop}`,
    //       ""
    //     );
    //     sessionData.edit_page = session.pgurl[session.pgurl.length - 1].replace(
    //       `https://${shop}`,
    //       ""
    //     );
    //   }
    //   sessionData.countryCode = session.countryCode;
    //   sessionData.Created_at = session?.created?.getTime();
    //   // devices[session.osInfo] += 1;

    //   // total_time += sessionData.total_time;

    //   data.push(sessionData);
    // });

    const newData = Object.fromEntries(unique_mvp);
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
            r = Object.entries(r).filter(([k, v]) => v == r.max && k != "max");
            return r.map((x) => x[0]);
          }
          return r;
        },
        { max: 0 }
      );

    finalData.forEach((fData) => {
      let sessionData = {
        sessionId: fData.sessionId,
        total_visits: 0,
        total_time: 0,
        isp: "Bharti Airtel",
        Ip_Info: "192.68.2.9",
        country_code: "in",
        location: "Delhi",
        countryCode: 91,
        pages: 2,
        // landing_page: "",
        // edit_page: "",
        most_visited: "",
        Created_at: "",
        tags: "Click to Tag",
        activity: "",
        avg_time: 1.0,
      };
      let devices = {};
      let max_devices = { count: 0 };
      // let count1 = 0;

      sessions.forEach(async (session) => {
        if (session.sessionId === fData.sessionId) {
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
          sessionData.Ip_Info = session.ipInfo;
          sessionData.isp = session.isp;
          sessionData.location = session.location;
          sessionData.pages = session.pgurl.length;
          sessionData.country_code = session.countryCode;
          sessionData.activity = session?.userActivity;
          if (session.recording && session.recording.length !== 0) {
            sessionData.sessionId = session.recording[0].recId;
            sessionData.activity = session.recording[0].timeDuration;
          }
          if (session.pgurl.length !== 0) {
            // sessionData.landing_page = session.pgurl[0].replace(
            //   `https://${shop}`,
            //   ""
            // );
            // sessionData.edit_page = session.pgurl[
            //   session.pgurl.length - 1
            // ].replace(`https://${shop}`, "");
            let removedURL = 0;
            if (mostFrequent(fData.pgurl)[0].split("/")[0] === "https:") {
              removedURL =
                mostFrequent(fData.pgurl)[0].split("/")[2].length + 8; //8 is length of "https://"
            } else if (mostFrequent(fData.pgurl)[0].split("/")[0] === "http:") {
              removedURL =
                mostFrequent(fData.pgurl)[0].split("/")[2].length + 7; //7 is length of "http://"
            }
            sessionData.most_visited = mostFrequent(fData.pgurl)[0]
              .slice(removedURL)
              .split("?")[0];
          }
          sessionData.countryCode = session.countryCode;
          sessionData.Created_at = session?.created?.getTime();
          devices[session.osInfo] += 1;
          console.log(session.recording);
        }
      });

      total_time += sessionData.total_time;
      total_visits += sessionData.total_visits;

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

    data.sort((a, b) => {
      return b.total_visits - a.total_visits;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
    console.log(e);
  }
});

router.post("/local", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
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
    console.log(sessions);

    console.log(blocked);
    console.log(sessions[0].created.getTime());
    if (start)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() >= start
      );
    if (end)
      sessions = sessions.filter(
        (session) => session?.created?.getTime() <= end
      );

    let sessionIds = sessions.map((session) => session.sessionId);
    sessionIds = [...new Set(sessionIds)];
    console.log("most repeaters");
    console.log(sessionIds);

    let total_visits = 0,
      total_time = 0;
    let data = [];

    sessionIds.forEach((sessionId) => {
      let sessionData = {
        sessionId: sessionId,
        total_visits: 0,
        total_time: 0,
        isp: "Bharti Airtel",
        ipInfo: "192.68.2.9",
        created: Date.now(),
        location: "Delhi",
        countryCode: 91,
        pages: 2,
        landing_page: "",
        edit_page: "",
        created: "",
        tags: "Click to Tag",
        activity: "",
      };
      let devices = {};
      let max_devices = { count: 0 };

      sessions.forEach(async (session) => {
        if (session.sessionId === sessionId) {
          sessionData.total_time +=
            session?.updated?.getTime() - session?.created?.getTime();
          sessionData.total_visits += 1;
          sessionData.ipInfo = session.ipInfo;
          sessionData.isp = session.isp;

          sessionData.activity = session.userActivity;
          sessionData.location = session.location;
          sessionData.pages = session.pgurl.length;
          if (session.recording && session.recording.length !== 0) {
            sessionData.sessionId = session.recording[0].recId;
            sessionData.activity = session.recording[0].timeDuration;
          }
          if (session.pgurl.length !== 0) {
            sessionData.landing_page = session.pgurl[0].replace(
              `https://${shop}`,
              ""
            );
            sessionData.edit_page = session.pgurl[
              session.pgurl.length - 1
            ].replace(`https://${shop}`, "");
          }
          sessionData.countryCode = session.countryCode;
          sessionData.created = session?.created?.getTime();
          devices[session.osInfo] += 1;
          console.log(session.recording);
        }
      });

      total_time += sessionData.total_time;
      total_visits += sessionData.total_visits;

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
      sessionData.total_visits = sessionData.total_visits / total_visits;
      sessionData.avg_time = sessionData.total_time / total_time;
    });

    data.sort((a, b) => {
      return b.total_visits - b.total_visits;
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
