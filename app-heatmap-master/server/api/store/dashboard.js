import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import Merchant from "../../models/merchant";
import SessionInfo from "../../models/sessionInfo";
import Cookie from "../../models/cookies";
import LiveUser from "../../models/liveuser";
import Membership from "../../models/membership";
import { createClient } from "../../handlers/client";
var geoip = require("geoip-country");
import axios from "axios";

const router = Router();
// satyakidevstore.myshopify.com

router.get("/", async (ctx) => {
  console.log("IN Dashboard");
});

router.post("/browsers", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // const shop ="deepakdaphnis11.myshopify.com"
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // var startdate, enddate;
    // if (start) startdate = new Date(start);
    // if (end) enddate = new Date(end);
    // console.log(`${startdate} ${enddate}`);
    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // console.log(sessions, "session");
    // if (start && end)
    //   sessions = sessions.filter(
    //     (session) =>
    //       session?.created?.getTime() >= start &&
    //       session?.created?.getTime() <= end
    //   );

    console.log(start, end, sessions, "hi");
    let browsers = sessions.map((session) => session.browser);
    console.log(browsers, "browsers");
    browsers = [...new Set(browsers)];

    let total_visits = sessions.length;
    let data = [];

    browsers.forEach((browser) => {
      let browserData = {
        name: browser,
        value: Math.round(
          (100 *
            sessions.filter((session) => {
              return session.browser === browser;
            }).length) /
            total_visits
        ),
      };
      if (browserData.name === "") browserData.name = "Unknown";
      data.push(browserData);
    });
    console.log(data, "this is data-");
    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post("/devices", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    let devices = sessions.map((session) => session.osInfo);
    devices = [...new Set(devices)];

    let total_users = sessions.length;
    let data = [];

    devices.forEach((device) => {
      let deviceData = {
        name: device,
        value: Math.round(
          (100 *
            sessions.filter((session) => {
              return session.osInfo === device;
            }).length) /
            total_users
        ),
      };
      data.push(deviceData);
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
//
router.post("/pages", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // const shop ="deepakdaphnis11.myshopify.com"
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lte: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    let map = new Map();
    var total_visits = 0;

    sessions.forEach((s) => {
      s.pgurl.forEach((url) => {
        total_visits++;
        let newUrl = url.split("?")[0];
        if (map.has(newUrl)) map.set(newUrl, map.get(newUrl) + 1);
        else {
          map.set(newUrl, 1);
        }
      });
    });
    console.log(map);

    let data = [];

    map.forEach((key, url) => {
      let pageData = {
        name: url,
        value: Math.round((key * 100) / total_visits),
      };
      data.push(pageData);
    });

    data.sort((a, b) => {
      return b.value - a.value;
    });

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
//
router.post(
  "/check-plan",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // const { shop } = "deepakdaphnis11.myshopify.com"
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

      if (total_visits > plan.max_page_views) {
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          expired: true,
          message: "Your plan is expired. Please upgrade your plan",
        };
      } else {
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          expired: false,
        };
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: e.message,
      };
    }
  }
);

router.get(
  "/pages_count",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({
        shop,
      });
      const { start, end } = ctx.request.body;

      let sessions;
      if (start && end) {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const priorDate = d1.toISOString();
        const nowDate = d2.toISOString();

        sessions = await SessionInfo.find({
          merchantId: doc.id,
          created: {
            $gte: `${priorDate}`,
            $lt: `${nowDate}`,
          },
        });
      } else {
        sessions = await SessionInfo.find({
          merchantId: doc.id,
        });
      }

      // let sessions = await SessionInfo.find({ merchantId: doc.id });
      // if (start)
      //   sessions = sessions.filter(
      //     (session) => session?.created?.getTime() >= start
      //   );
      // if (end)
      //   sessions = sessions.filter(
      //     (session) => session?.created?.getTime() <= end
      //   );

      var total_visits = 0;
      sessions.forEach((s) => {
        total_visits += s.pgurl.length;
      });

      ctx.response.status = 200;
      ctx.response.body = {
        status: 200,
        pages: total_visits,
      };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/sources", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    let sources = sessions.map((session) => session.source);
    sources = [...new Set(sources)];

    let total_users = sessions.length;
    let data = [];

    sources.forEach((source) => {
      let sourceData = {
        name: source,
        value:
          (100 *
            sessions.filter((session) => {
              return session.source === source;
            }).length) /
          total_users,
      };
      data.push(sourceData);
    });
    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.get(
  "/live-visitors",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // const shop ="deepakdaphnis11.myshopify.com"
      const doc = await Merchant.findOne({
        shop,
      });

      const { start, end } = ctx.request.query;
      // var startdate, enddate;
      // if (start) startdate = new Date(start);
      // if (end) enddate = new Date(end);

      let sessions, cookies;
      if (start && end) {
        const d1 = new Date(parseInt(start));
        const d2 = new Date(parseInt(end));
        const priorDate = d1.toISOString();
        const nowDate = d2.toISOString();

        sessions = await SessionInfo.find({
          merchantId: doc.id,
          created: {
            $gte: `${priorDate}`,
            $lt: `${nowDate}`,
          },
        });
        cookies = await LiveUser.find({
          merchantId: doc.id,
          createdAt: {
            $gte: `${priorDate}`,
            $lt: `${nowDate}`,
          },
        });
      } else {
        sessions = await SessionInfo.find({
          merchantId: doc.id,
        });
        cookies = await LiveUser.find({ merchantId: doc.id });
      }

      // =====================
      // let cookies = await LiveUser.find({ merchantId: doc.id });
      // let sessions = await SessionInfo.find({
      //   merchantId: doc.id,
      //   created: { $gt: new Date(Date.now() - 1000 * 60 * 60 * 96) },
      // });

      // if (start && end) {
      //   sessions = sessions.filter(
      //     (session) =>
      //       session?.created?.getTime() >= start &&
      //       session?.created?.getTime() <= end
      //   );
      //   cookies = cookies.filter(
      //     (cookie) =>
      //       cookie?.createdAt?.getTime() >= start &&
      //       cookie?.createdAt?.getTime() <= end
      //   );
      // }
      // ==================
      const data = {
        live_users: cookies?.length,
        new_users: sessions?.length,
      };
      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      console.log("$$", e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/local/location", async (ctx) => {
  try {
    const shop = ctx.request.query.shop;
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    let locations = sessions.map((session) => session.countryCode);
    locations = [...new Set(locations)];

    console.log(sessions);

    let maps = [];

    locations.forEach((location) => {
      let locationData = {
        country: location,
        value: sessions.filter((session) => {
          return session.countryCode === location;
        }).length,
      };

      maps.push(locationData);
    });

    const data = [
      { locations: locations },
      { country: "cn", value: 1389618778 }, // china
      { country: "in", value: 1311559204 }, // india
      { country: "us", value: 331883986 }, // united states
      { country: "id", value: 264935824 }, // indonesia
      { country: "pk", value: 210797836 }, // pakistan
      { country: "br", value: 210301591 }, // brazil
      { country: "ng", value: 208679114 }, // nigeria
      { country: "bd", value: 161062905 }, // bangladesh
      { country: "ru", value: 141944641 }, // russia
      { country: "mx", value: 127318112 }, // mexico
    ];

    ctx.response.status = 200;
    ctx.response.body = maps;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});
router.get(
  "/app_blocks",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop, accessToken } = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res
      );
      // const { shop, accessToken } = ctx.request.query;
      // console.log(shop);
      const data = await checkAppBlock(shop, accessToken);
      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      console.log(e);
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/location", verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;

    let sessions;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // let sessions = await SessionInfo.find({ merchantId: doc.id });
    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    let locations = sessions.map((session) => session.countryCode);
    locations = [...new Set(locations)];

    console.log(sessions);

    let maps = [];

    locations.forEach((location) => {
      let locationData = {
        country: location,
        value: sessions.filter((session) => {
          return session.countryCode === location;
        }).length,
      };

      maps.push(locationData);
    });

    const data = [
      { locations: locations },
      { country: "cn", value: 1389618778 }, // china
      { country: "in", value: 1311559204 }, // india
      { country: "us", value: 331883986 }, // united states
      { country: "id", value: 264935824 }, // indonesia
      { country: "pk", value: 210797836 }, // pakistan
      { country: "br", value: 210301591 }, // brazil
      { country: "ng", value: 208679114 }, // nigeria
      { country: "bd", value: 161062905 }, // bangladesh
      { country: "ru", value: 141944641 }, // russia
      { country: "mx", value: 127318112 }, // mexico
    ];

    ctx.response.status = 200;
    ctx.response.body = maps;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post(
  "/unique-visits",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // const shop ="sekhharrstore.myshopify.com"
      const doc = await Merchant.findOne({
        shop,
      });
      const { start, end } = ctx.request.body;

      let sessions;
      let d1, d2;
      if (start && end) {
        d1 = new Date(start);
        d2 = new Date(end);
        const priorDate = d1.toISOString();
        const nowDate = d2.toISOString();

        sessions = await SessionInfo.find({
          merchantId: doc.id,
          created: {
            $gte: `${priorDate}`,
            $lt: `${nowDate}`,
          },
        });
      } else {
        sessions = await SessionInfo.find({
          merchantId: doc.id,
        });
      }

      // console.log("$$$$",sessions);

      let dataX = [];
      let dataY = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let map = new Map();
      console.log(sessions);

      // for (let i = start; i <= end; i += 86400000) {
      //   let count = 0;
      //   sessions.forEach((session) => {
      //     if (
      //       session?.updated?.getTime() >= i &&
      //       session?.updated?.getTime() <= i + 86400000 &&
      //       map.get(session.ipInfo)
      //     ) {
      //       count++;
      //       map.set(session.ipInfo, true);
      //     }
      //   });
      //   const d = new Date(i);
      //   dataX.push(d.getDate() + " " + months[d.getMonth()]);
      //   dataY.push(count);
      // }

      let noOfDays = Math.ceil((end - start) / 86400000);
      const h1 = d1.getUTCHours();
      const h2 = d2.getUTCHours();
      const m1 = d1.getUTCMinutes();
      const m2 = d2.getUTCMinutes();
      // console.log(h1, "====", m1, "====", h2, "==", m2);
      if (h1 * 60 + m1 >= h2 * 60 + m2) noOfDays++;

      for (let i = start, j = 1; j <= noOfDays; i += 86400000, j++) {
        let count = 0;
        var date = new Date(i);
        date = date.toLocaleDateString(`fr-CA`).split("/").join("-");
        console.log(date);
        let uniqueIp = new Map();
        sessions.forEach((session) => {
          const j = session.created
            .toLocaleDateString(`fr-CA`)
            .split("/")
            .join("-");
          const exactDate = session.created;
          // console.log("&&&&&&", exactDate, typeof(exactDate),"==", d1, d2)
          if (j == date && !uniqueIp.has(session.ipInfo)) {
            if (exactDate <= d2 && exactDate >= d1) {
              count++;
              uniqueIp.set(session.ipInfo, 1);
            }
          }
        });
        const d = new Date(i);
        dataX.push(d.getDate() + " " + months[d.getMonth()]);
        dataY.push(count);
      }

      ctx.response.status = 200;
      ctx.response.body = {
        dataX: dataX,
        dataY: dataY,
      };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post(
  "/total-visits",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      // const shop ="sekhharrstore.myshopify.com"
      const doc = await Merchant.findOne({
        shop,
      });
      const { start, end } = ctx.request.body;

      let d1, d2, priorDate, nowDate;
      let sessions;
      if (start && end) {
        d1 = new Date(start);
        d2 = new Date(end);
        console.log("&&", d1, d2);

        priorDate = d1.toISOString();
        nowDate = d2.toISOString();

        console.log("%%", priorDate, nowDate, typeof priorDate);

        sessions = await SessionInfo.find({
          merchantId: doc.id,
          created: {
            $gte: priorDate,
            $lte: nowDate,
          },
        });
      } else {
        sessions = await SessionInfo.find({
          merchantId: doc.id,
        });
      }

      let dataX = [];
      let dataY = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let noOfDays = Math.ceil((end - start) / 86400000);
      const h1 = d1.getUTCHours();
      const h2 = d2.getUTCHours();
      const m1 = d1.getUTCMinutes();
      const m2 = d2.getUTCMinutes();
      console.log(h1, "====", m1, "====", h2, "==", m2);
      if (h1 * 60 + m1 >= h2 * 60 + m2) noOfDays++;
      // let dys = sessions.map((session)=>{
      //   const j = session.created
      //   .toLocaleDateString(`fr-CA`)
      //   .split("/")
      //   .join("-");
      //   return j;
      // })
      // console.log("%%dys",dys);
      // let uniqueDates = [ new Set(dys) ];
      // console.log("%%dys",uniqueDates);
      // let noOfDays = uniqueDates.length;

      console.log(noOfDays, "%%%%%%%");
      for (let i = start, j = 1; j <= noOfDays; i += 86400000, j++) {
        let count = 0;
        var date = new Date(i);
        date = date.toLocaleDateString(`fr-CA`).split("/").join("-");
        console.log(date);
        sessions.forEach((session) => {
          const j = session.created
            .toLocaleDateString(`fr-CA`)
            .split("/")
            .join("-");
          const exactDate = session.created;
          // console.log("&&&&&&", exactDate, typeof(exactDate),"==", d1, d2)
          if (j == date) {
            if (exactDate <= d2 && exactDate >= d1) count++;
          }
        });
        const d = new Date(i);
        dataX.push(d.getDate() + " " + months[d.getMonth()]);
        dataY.push(count);
      }

      ctx.response.status = 200;
      ctx.response.body = {
        dataX: dataX,
        dataY: dataY,
      };
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

router.post("/total-visits/local", async (ctx) => {
  try {
    const shop = "test-heatmap01.myshopify.com";
    const doc = await Merchant.findOne({
      shop,
    });
    const { start, end } = ctx.request.body;
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const priorDate = d1.toISOString();
      const nowDate = d2.toISOString();

      sessions = await SessionInfo.find({
        merchantId: doc.id,
        created: {
          $gte: `${priorDate}`,
          $lt: `${nowDate}`,
        },
      });
    } else {
      sessions = await SessionInfo.find({
        merchantId: doc.id,
      });
    }

    // if (start)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() >= start
    //   );
    // if (end)
    //   sessions = sessions.filter(
    //     (session) => session?.created?.getTime() <= end
    //   );

    let dataX = [];
    let dataY = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = start; i <= end; i += 86400000) {
      let count = 0;
      var date = new Date(i);
      date = date.toLocaleDateString(`fr-CA`).split("/").join("-");
      console.log(date);
      sessions.forEach((session) => {
        const j = session.created
          .toLocaleDateString(`fr-CA`)
          .split("/")
          .join("-");
        if (j == date) count++;
      });
      const d = new Date(i);
      dataX.push(d.getDate() + " " + months[d.getMonth()]);
      dataY.push(count);
    }

    ctx.response.status = 200;
    ctx.response.body = {
      dataX: dataX,
      dataY: dataY,
    };
  } catch (e) {
    console.log(e);
    ctx.response.status = 400;
    ctx.response.body = e;
  }
});

router.post(
  "/products-viewed",
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    try {
      const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const doc = await Merchant.findOne({
        shop,
      });
      const { start, end } = ctx.request.body;

      let sessions;
      if (start && end) {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const priorDate = d1.toISOString();
        const nowDate = d2.toISOString();

        sessions = await SessionInfo.find({
          merchantId: doc.id,
          created: {
            $gte: `${priorDate}`,
            $lt: `${nowDate}`,
          },
        });
      } else {
        sessions = await SessionInfo.find({
          merchantId: doc.id,
        });
      }

      // let sessions = await SessionInfo.find({ merchantId: doc.id });
      // if (start)
      //   sessions = sessions.filter(
      //     (session) => session?.created?.getTime() >= start
      //   );
      // if (end)
      //   sessions = sessions.filter(
      //     (session) => session?.created?.getTime() <= end
      //   );
      let map = new Map();
      var total_visits = 0;
      var product_viewed = 0;
      var product_checkouts = 0;
      var thank_you = 0;
      sessions.forEach((s) => {
        s.pgurl.forEach((url) => {
          total_visits++;
          if (url.includes("/products/")) product_viewed++;
          if (url.includes("/checkouts/")) product_checkouts++;
          if (url.includes("/thank_you/")) thank_you++;
        });
      });

      const data = {
        product_viewed: product_viewed,
        product_added_to_cart: product_checkouts,
        product_purchased: thank_you,
        complete: total_visits,
      };

      ctx.response.status = 200;
      ctx.response.body = data;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = e;
    }
  }
);

const checkAppBlock = async (shop, accessToken) => {
  const clients = {
    rest: new Shopify.Clients.Rest(shop, accessToken),
    graphQL: createClient(shop, accessToken),
  };

  // Use `client.get` to request list of themes on store
  const {
    body: { themes },
  } = await clients.rest.get({
    path: "themes",
  });

  const publishedTheme = themes.find((theme) => theme.role === "main");

  const promise = axios({
    method: "get",
    url: `https://${shop}/admin/api/2022-01/themes/${publishedTheme.id}/assets.json?asset%5Bkey%5D=config%2Fsettings_data.json`,
    responseType: "json",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });
  const data = promise.then(function (response) {
    // handle success
    var data = JSON.parse(response.data.asset.value);

    const themeContent =
      "shopify://apps/z08-heatmap-and-recording/blocks/app-embed/";

    var newdata = [];
    if (data.current.blocks) {
      Object.entries(data.current.blocks).forEach(async (entry) => {
        const [key, value] = entry;
        console.log(value);

        if (value.type && value.type.includes(themeContent)) {
          newdata.push(value);
        }
      });
    }
    return newdata;
  });

  return data;
};

export default router;
