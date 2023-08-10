import Router from "koa-router";
import Merchant from "../models/merchant";
import SessionInfo from "../models/sessionInfo";
import RecordingInfo from "../models/recording";
import Recording from "../models/recordingInfo";
import AuthToken from "../models/authTokens";
import Cookie from "../models/cookies";
import uniqid from "uniqid";
import HeatMapCoords from "../models/heatmapCoords";
import pako from "pako";
import { getName } from "../globalSetter.js";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify from "@shopify/shopify-api";
import { v4 as uuidv4 } from "uuid";
import LiveUser from "../models/liveuser";
import IpRecords from "../models/iprecords";
import { get } from "http";
import { checkPlan } from "../middleware/checkplan";
var ipInfoApi = require("ip-info-finder");
const { IP2Location } = require("ip2location-nodejs");
const axios = require("axios");

const fs = require("fs");
var whois = require("whois-ux");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const router = Router();

router.get("/session-id", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
    // const doc = await Merchant.findOne({ shop });
    ctx.response.status = 200;
    ctx.response.body = uniqid();
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
router.get("/recording-id", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
    // const doc = await Merchant.findOne({ shop });
    ctx.response.status = 200;
    ctx.response.body = uniqid();
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

async function getData(ip) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

async function saveIntoDB(ip) {
  return new Promise(async (resolve, reject) => {
    const isFound = await IpRecords.findOne({ ip });
    if (!isFound) {
      const ipdata = await getData(ip);
      // const ipdata = ip;
      var iprecords = new IpRecords({
        ip: ipdata.ip,
        // hostname: ipdata.hostname,
        hostname: "ipdata.hostname",
        city: ipdata.city,
        country: ipdata.country,
        region: ipdata.region,
        loc: ipdata.loc,
        org: ipdata.org,
        postal: ipdata.postal,
        timezone: ipdata.timezone,
      });
      await iprecords.save();

      resolve(ipdata);
    }

    resolve(isFound);
  });
}

router.get("/lookup-ip", async (ctx) => {
  try {
    const data = await saveIntoDB("142.250.194.3");

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "Something went wrong.";
  }
});

router.post("/add-user-session-info", checkPlan, async (ctx) => {
  console.log("Post Route Triggered from Backend");

  try {
    const shop = ctx.request.query.shop;
    const {
      browser,
      osInfo,
      path,
      userActivity,
      sessionId,
      pgurl,
    } = ctx.request.body;

    let ipInfo = ctx.request.headers["x-forwarded-for"];

    console.log("ip user session", ipInfo.split(", ")[1]);

    console.log("Entered try block");
    console.log(browser, osInfo, path, userActivity, sessionId);
    const doc = await Merchant.findOne({ shop: shop });

    const data = await saveIntoDB(ipInfo.split(", ")[1]);

    const session = await SessionInfo.findOne({
      merchantId: doc.id,
      sessionId,
    });
    if (session) {
      await SessionInfo.findOneAndUpdate(
        { merchantId: doc.id, sessionId },
        {
          sessionId: sessionId,
          updated: new Date(),
          pgurl: session.pgurl.concat(pgurl),
        }
      );
    } else {
      const insertSessionInfo = new SessionInfo({
        merchantId: doc.id,
        sessionId: sessionId,
        browser: browser,
        ipInfo: data.ip,
        osInfo: osInfo,
        userActivity: userActivity,
        path: path,
        pgurl: pgurl,
        isp: data.org.split(" ").slice(1).join(" "),
        created: new Date(),
        location: data.city,
        updated: new Date(),
        countryCode: data.country,
      });
      await insertSessionInfo.save();
    }
    ctx.response.status = 200;
    ctx.response.body = "inserted successfuly";
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post("/send-recording", checkPlan, async (ctx) => {
  console.log("recording route triggered");
  try {
    const shop = ctx.request.query.shop;

    const doc = await Merchant.findOne({ shop: shop });

    const {
      recording,
      id,
      sessionId,
      timeDuration,
      browser,
      os,
      pgurl,
      ip,
    } = ctx.request.body;

    let ipInfo = ctx.request.headers["x-forwarded-for"];

    const clientIP = ctx.request.ip;
    console.log("ip information", ipInfo.split(", ")[1]);

    const data = await saveIntoDB(ipInfo.split(", ")[1]);

    const isRec = await RecordingInfo.findOne({
      merchantId: doc.id,
      recId: id,
      sessionId: sessionId,
    });

    // await SessionInfo.findOneAndUpdate(
    //   { merchantId: doc.id },
    //   { recording: id },
    //   { new: true, upsert: true }
    // );

    const isLive = await LiveUser.exists({
      merchantId: doc.id,
      liveId: id,
    });

    if (!isLive) {
      const liveUser = new LiveUser({
        merchantId: doc.id,
        liveId: id,
      });
      await liveUser.save();
    } else {
      await LiveUser.findOneAndUpdate(
        { liveId: id },
        { new: true, upsert: true }
      );
    }

    let parNewRec = JSON.parse(recording).events;

    if (!parNewRec || !id) return;
    if (!isRec) {
      console.log("rec if");
      const dir = "./recordings/" + id;
      fs.mkdirSync(dir, { recursive: true });

      fs.appendFile(
        `./recordings/${id}/${id}.txt`,
        JSON.stringify(parNewRec),
        function (err) {
          if (err) return console.log(err);
          console.log("Appended!");
        }
      );

      const newRec = new RecordingInfo({
        merchantId: doc.id,
        recId: id,
        sessionId: sessionId,
        created: new Date(),
        updated: new Date(),
        // recording: JSON.stringify(parNewRec),
      });
      await newRec.save();
      const newInfo = new Recording({
        merchantId: doc.id,
        recId: id,
        sessionId: sessionId,
        created: new Date(),
        updated: new Date(),
        ispInfo: data.org.split(" ").slice(1).join(" "),
        ipInfo: data.ip,
        location: data.city,
        browser: browser,
        device: os,
        pageurl: pgurl,
        count: parNewRec.length,
        startTime: parNewRec[0].timestamp,
        endTime: parNewRec[parNewRec.length - 1].timestamp,
        timeDuration: timeDuration,
      });
      let recordingMap = {
        recId: id,
        created: new Date(),
        updated: new Date(),
        startTime: parNewRec[0].timestamp,
        endTime: parNewRec[parNewRec.length - 1].timestamp,
        timeDuration: timeDuration,
      };
      let list = [];
      list.push(recordingMap);
      await SessionInfo.findOneAndUpdate(
        {
          merchantId: doc.id,
          sessionId: sessionId,
        },
        { recording: list },
        { new: true, upsert: true }
      );

      await newInfo.save();
    } else {
      let rec = await RecordingInfo.findOne({ recId: id });
      console.log("rec else");

      const data = await fs.readFileSync(
        `./recordings/${id}/${id}.txt`,
        "utf8"
      );
      let parRec = JSON.parse(data);
      // console.log(parRec);
      // let parRec = JSON.parse(rec.recording);
      parRec.push(...parNewRec);
      // console.log(parRec.length + "  " + parNewRec.length);
      await fs.unlinkSync(`./recordings/${id}/${id}.txt`);
      fs.appendFile(
        `./recordings/${id}/${id}.txt`,
        JSON.stringify(parRec),
        function (err) {
          if (err) return console.log(err);
          console.log("Appended!");
        }
      );

      await RecordingInfo.findOneAndUpdate(
        { recId: id },
        // { recording: JSON.stringify(parRec) },
        { new: true, upsert: true }
      );
      const previousrec = await Recording.findOne({
        merchantId: doc.id,
        recId: id,
      });

      const preSession = await SessionInfo.findOne({
        merchantId: doc.id,
        sessionId: sessionId,
      });

      let recordingMap = {
        recId: id,
        created: new Date(),
        updated: new Date(),
        count: previousrec.count + parNewRec.length,
        startTime: preSession.recording[0].startTime,
        endTime: parNewRec[parNewRec.length - 1]
          ? parNewRec[parNewRec.length - 1].timestamp
          : parNewRec.timestamp,
        timeDuration: (
          parseInt(previousrec.timeDuration) + parseInt(timeDuration)
        ).toString(),
      };
      let list = [];
      list.push(recordingMap);
      await SessionInfo.findOneAndUpdate(
        {
          merchantId: doc.id,
          sessionId: sessionId,
        },
        { recording: list },
        { new: true, upsert: true }
      );

      await Recording.findOneAndUpdate(
        { merchantId: doc.id, recId: id },
        {
          updated: new Date(),
          count: previousrec.count + parNewRec.length,
          endTime: parNewRec[parNewRec.length - 1]
            ? parNewRec[parNewRec.length - 1].timestamp
            : parNewRec.timestamp,
          timeDuration: (
            parseInt(previousrec.timeDuration) + parseInt(timeDuration)
          ).toString(),
        },
        { upsert: true }
      );
    }

    console.log("rec success");
    ctx.response.status = 200;
    ctx.response.body = { success: true };
  } catch (e) {
    console.log("in Catch ", e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.get("/get-record", async (ctx) => {
  try {
    console.log("in");
    const recId = ctx.query.id;
    let rec = await RecordingInfo.findOne({ recId: recId });
    const recString = fs.readFile(filename, "utf8");
    rec["recording"] = recString;
    ctx.response.status = 200;
    ctx.response.body = rec;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "Something went wrong.";
  }
});

// Generate Token
router.get(
  "/generate-admin-auth-token",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      console.log("in");
      // verifyRequest({ returnHeader: true }),
      const shop = getName();
      const doc = await Merchant.findOne({
        shop: shop,
      });
      console.log(doc);
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i <= 24; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      console.log(result);
      // const doc = await Merchant.findOne({ shop: shop });
      const session = await SessionInfo.findOne({
        merchantId: doc._id,
      });
      console.log(doc._id);
      const authToken = new AuthToken({
        sessionId: session.sessionId,
        token: result,
        merchantID: doc._id,
      });
      const res = await authToken.save();
      ctx.response.status = 200;
      ctx.response.body = res;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = "Something went wrong.";
    }
  }
);

router.post(
  "/verify-admin",
  // verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { token } = ctx.request.body;
      const shop = getName();
      const doc = await Merchant.findOne({
        shop: shop,
      });
      console.log(doc);
      const lastToken = await AuthToken.find({ merchantID: doc._id })
        .sort({ createdAt: -1 })
        .limit(1);
      // let lastToken = session.authTokens[authToken.length - 1];
      // // const authToken = await AuthToken.find({
      //   sessionId: session.sessionId,
      //   token,
      // });

      // console.log(authToken, token);
      ctx.response.status = 200;
      console.log(lastToken);
      ctx.response.body =
        lastToken.length !== 0 && lastToken[0].token === token;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = "Something went wrong.";
    }
  }
);

//generate cookies id
router.post("/generate-cookie-id", async (ctx) => {
  try {
    console.log("in");
    const shop = getName();
    const { url, cookieid, userSessionId } = ctx.request.body;
    // const shop = ctx.request.query.shop;
    const doc = await Merchant.findOne({
      shop,
    });

    var res;
    if (cookieid && cookieid !== "") {
      res = await Cookie.findOne({ cookieId: cookieid, merchantID: doc.id });
    } else {
      const id = uuidv4();
      const cookie = new Cookie({
        cookieId: id,
      });

      res = await cookie.save();
    }

    ctx.response.status = 200;
    ctx.response.body = res;
  } catch (e) {
    console.log("in Catch ", e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

// coordinate APIs
router.post("/send-coords", checkPlan, async (ctx) => {
  try {
    console.log("in");
    const { screenSize, coords, url, mapId, userSessionId } = ctx.request.body;
    const shop = ctx.request.query.shop;
    const doc = await Merchant.findOne({
      shop,
    });
    console.log("\n", screenSize, coords, url, mapId, userSessionId, "\n");
    // const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);

    // const client = new Shopify.Clients.Rest(shop, accessToken);
    // const data = await client.get({
    //   path: "pages",
    // });
    // console.log(data);
    const session = await SessionInfo.findOne({
      merchantId: doc.id,
    });
    let coordsMap = await HeatMapCoords.findOneAndUpdate(
      {
        merchantId: doc.id,
        userSessionId,
        url,
        screenSize,
        mapId,
        sessionId: session.id,
      },
      {
        $push: { coords: { $each: coords } },
      },
      { upsert: true, new: true }
    );
    console.log(coordsMap);
    ctx.response.status = 200;
    ctx.response.body = coordsMap;
  } catch (e) {
    console.log("in Catch ", e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

//fetch coordinates API

router.get("/get-coords", async (ctx) => {
  try {
    const { screenSize, url, start, end } = ctx.request.query;
    console.log(start, end);
    const coordsMap = await HeatMapCoords.find({
      url,
      createdAt: {
        $gte: new Date(start), // time format 2010-04-29T00:00:00.000Z
        $lt: new Date(end),
      },
    });
    let [adminX, adminY] = screenSize.split("x");
    console.log(screenSize.split("x"));
    adminX = parseFloat(adminX);
    adminY = parseFloat(adminY);
    var coords = [];
    let curatedData = coordsMap.map((elm) => {
      let [clientX, clientY] = elm.screenSize.split("x");
      clientX = adminX / parseFloat(clientX);
      clientY = adminY / parseFloat(clientY);
      elm.coords.forEach((arrelm) => {
        arrelm[0] *= clientX;
        arrelm[1] *= clientY;
      });
      coords = [...coords, ...elm.coords];
      return elm;
    });
    // console.log(curatedData);
    ctx.response.status = 200;
    ctx.response.body = { coords };
  } catch (e) {
    console.log("in Catch ", e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
// router.get("/get-coords", async (ctx) => {
//   try {
//     const doc = await Merchant.findOne({
//       shop: "rohandevstore.myshopify.com",
//     });
//     const coordsMap = await HeatMapCoords.findOne({ merchantId: doc.id });
//     ctx.response.status = 200;
//     ctx.response.body = coordsMap;
//   } catch (e) {
//     console.log("in Catch ", e);
//     ctx.response.status = 400;
//     ctx.response.body = e;
//   }
// });

router.get("/generate-token", async (ctx) => {
  try {
    const shop = getName();
    const doc = await Merchant.findOne({
      shop: shop,
    });
    const secret = process.env.SHOPIFY_API_SECRET;
    const token = jwt.sign(
      {
        merchant_id: doc._id,
        shop: shop,
        isAdmin: true,
      },
      secret,
      {
        expiresIn: 60 * 4,
        noTimestamp: false,
        issuer: "app-heatmap",
      }
    );
    await Merchant.updateOne(
      { shop: shop },
      { authToken: token },
      { upsert: true }
    );
    ctx.response.status = 200;
    ctx.response.body = token;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "Something went wrong.";
  }
});

router.get("/verify-token", async (ctx) => {
  try {
    const secret = process.env.SHOPIFY_API_SECRET;
    const token = ctx.request.header.token;
    const decoded = jwt.verify(token, secret, function (err) {
      if (err) {
        ctx.response.status = 400;
        ctx.response.body = err;
      }
    });
    ctx.response.status = 200;
    ctx.response.body = decoded;
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = "Something went wrong.";
  }
});

export default router;
