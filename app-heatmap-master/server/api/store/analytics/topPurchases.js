import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
var parser = require("parse-whois");
var whois = require("node-whois");

import Merchant from "../../../models/merchant";
import SessionInfo from "../../../models/sessionInfo";
import BlockedIp from "../../../models/blockedIPs";

const router = Router();
// satyakidevstore.myshopify.com
// const shop = "pranay-devstore.myshopify.com";

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

router.post("/", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
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
    let count1 = 0;
    let total_visits = 0,
      total_time = 0;
    let data = [];
    let count = 0;
    sessionIds.forEach((sessionId) => {
      let sessionData = {
        sessionId: sessionId,
        total_visits: 0,
        total_time: 0,
        isp: "Bharti Airtel",
        ipInfo: "192.68.2.9",
        Created_at: "",
        location: "Delhi",
        country_code: "in",
        pages: 2,

        landing_page: "/Collection/30",
        edit_page: "/Collection/30",
        tags: "Click to Tag",
        activity: "",
        purchase_url: 0,
      };
      let devices = {};
      let max_devices = { count: 0 };
      let count1 = 0;
      sessions.forEach(async (session) => {
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
          sessionData.country_code = session.country_code;
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
          sessionData.Created_at = session?.created?.getTime();
          sessionData.purchase_url += count;
          devices[session.osInfo] += 1;
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
      if (sessionData.purchase_url !== 0) data.push(sessionData);
    });

    data.forEach((sessionData) => {
      sessionData.total_visits = sessionData.total_visits / total_visits;
      sessionData.avg_time = Math.round(sessionData.total_time / count1);
    });

    data.sort((a, b) => {
      return b.purchase_url - a.purchase_url;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
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
        landingPage: "/Collection/30",
        exitPage: "/Collection/30",
        tags: "Click to Tag",
        activity: "",
        purchase_url: 0,
      };
      let devices = {};
      let max_devices = { count: 0 };

      sessions.forEach(async (session) => {
        if (session.sessionId === sessionId) {
          let count = 0;
          session.pgurl.find((element) => {
            if (element.includes("/thank_you/")) {
              count++;
            }
          });
          sessionData.total_time +=
            session?.updated?.getTime() - session?.created?.getTime();
          sessionData.total_visits += 1;
          sessionData.ipInfo = session.ipInfo;
          sessionData.isp = session.isp;
          sessionData.landingPage = session.pgurl[0];
          sessionData.activity = session.userActivity;
          sessionData.location = session.location;
          sessionData.pages = session.pgurl.length;
          sessionData.exitPage = session.pgurl[session.pgurl.length - 1];
          sessionData.countryCode = session.countryCode;
          sessionData.purchase_url += count;
          devices[session.osInfo] += 1;
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
      if (sessionData.purchase_url !== 0) data.push(sessionData);
    });

    data.forEach((sessionData) => {
      sessionData.total_visits = sessionData.total_visits / total_visits;
      sessionData.avg_time = sessionData.total_time / total_time;
    });

    data.sort((a, b) => {
      return b.purchase_url - a.purchase_url;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

export default router;
