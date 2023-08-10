import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import { connect as mongoose } from "mongoose";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import Merchant from "./models/merchant";
import storeRouter from "./api/store";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import shopRouter from "./api/shop";
const sendgrid = require("@sendgrid/mail");
const filesystem = require("fs");
import { updateTheme } from "./updateTheme/updateTheme";
import { getName, setName } from "./globalSetter.js";
import { RSA_NO_PADDING } from "constants";
import { createClient } from "./handlers";
import Membership from "./models/membership";
import plans from "./config/plan";

const verifyWebhookIntegrity = require("shopify-verify-webhook");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
console.log(port, "port no.");
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
var shop_name;
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  // HOST_NAME: process.env.HOSTLT.replace(/https:\/\//, ""),
  API_VERSION: "2022-01",
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const dir = "./recordings";

if (!filesystem.existsSync(dir)) {
  filesystem.mkdirSync(dir, { recursive: true });
} else {
  console.log("Directory already exit");
}

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  // Use this for mongodb atlas "mongodb+srv://daphnis:daphnis@cluster0.crtej.mongodb.net/app-heatmap?retryWrites=true&w=majority"
  // "mongodb://localhost:27017/heatmapDB"
  mongoose(
    "mongodb+srv://daphnis:daphnis@cluster0.crtej.mongodb.net/app-heatmap?retryWrites=true&w=majority",
    // "mongodb://localhost:27017/heatmapDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
    .then(console.log("connected to database"))
    .catch((err) => {
      console.log("error : " + err);
    });

  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    bodyParser({
      formLimit: "100000mb",
      jsonLimit: "100000mb",
      textLimit: "100000mb",
    })
  );

  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        shop_name = shop;
        console.log("SHOP -------> ", shop);
        console.log("Access Token -------> ", accessToken);
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        const client = new Shopify.Clients.Rest(shop, accessToken);

        const data = await client.get({
          path: "shop",
        });
        // sendEmail(data);

        console.log("start updating theme");

        const clients = {
          rest: new Shopify.Clients.Rest(shop, accessToken),
          graphQL: createClient(shop, accessToken),
        };

        // updateTheme(shop, accessToken);

        const APP_BLOCK_TEMPLATES = ["product"];

        // Use `client.get` to request list of themes on store
        const {
          body: { themes },
        } = await clients.rest.get({
          path: "themes",
        });

        const publishedTheme = themes.find((theme) => theme.role === "main");

        // Get list of assets contained within the published theme
        const {
          body: { assets },
        } = await clients.rest.get({
          path: `themes/${publishedTheme.id}/assets`,
        });

        console.log(publishedTheme.id, accessToken, shop);

        const templateJSONFiles = assets.filter((file) => {
          return APP_BLOCK_TEMPLATES.some(
            (template) => file.key === `templates/${template}.json`
          );
        });

        console.log(templateJSONFiles);

        if (templateJSONFiles.length === 0) {
          console.log("starting updating theme");
          updateTheme(shop, accessToken);
        }

        const isMerchant = await Merchant.exists({ shop: shop });

        const shopdata = await clients.rest.get({
          path: "shop",
        });

        if (!isMerchant) {
          const newMerchant = new Merchant({
            shop: shop,
            accessToken: accessToken,
            uninstall: true,
          });
          await newMerchant.save();
          sendEmail(shopdata);

          // Redirect to registration page for new merchants
          // ctx.redirect(`/store/registration?shop=${shop}`);
        } else {
          let updated = await Merchant.findOneAndUpdate(
            { shop: shop },
            { accessToken: accessToken },
            { new: true }
          );
          if (!updated.uninstall) {
            await Merchant.findOneAndUpdate(
              { shop: shop },
              { uninstall: true },
              { new: true }
            );
            sendEmail(shopdata);

            console.log(updated, "updated merchant data");
          }

          console.log(updated, "updated merchant data");
        }
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
        console.log("**********");
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  const sendEmail = async (data) => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    console.log(data.body.shop.email);
    const msg = {
      to: data.body.shop.email,
      // Change to your recipient
      from: "heatmap@mailer.z08tech.com",
      // Change to your verified sender
      subject: "Welcome to Z08 - Heatmap App",
      html: `<p>Hi ${data.body.shop.name}</p> <p>Welcome to Z08 - Heatmap App , we are always here to help you in your successful Integration and any other assistance related to our app. You can email us at support@z08tech.com OR whatsapp us at wa.me/971528782774 If you wish to setup a teams call for us to better understand your requirements, a meeting can be scheduled with us directly via this link: https://calendly.com/z08tech/shopify-integration-support</p>`,
    };
    console.log("sendgrid response");
    const res = await sendgrid.send(msg);
    console.log(res);
  };

  router.post("/webhooks", async (ctx) => {
    try {
      const shop = ctx.request.header["x-shopify-shop-domain"];
      delete ACTIVE_SHOPIFY_SHOPS[shop];
      await Merchant.findOneAndUpdate(
        { shop: shop },
        { uninstall: false },
        { new: true }
      );
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  const verifyWebhook = (ctx) => {
    const { rawBody } = ctx.request;
    if (!ctx.request.headers["x-shopify-hmac-sha256"] || rawBody == undefined) {
      return false;
    }
    const isValid = verifyWebhookIntegrity(
      process.env.SHOPIFY_API_SECRET,
      ctx.request.headers["x-shopify-hmac-sha256"],
      rawBody
    );
    if (isValid) {
      return true;
    }
    return false;
  };

  router.post("/customers/data_request", async (ctx) => {
    if (verifyWebhook(ctx)) {
      ctx.response.status = 200;
    } else {
      ctx.response.status = 400;
    }
  });

  router.post("/customers/redact", async (ctx) => {
    if (verifyWebhook(ctx)) {
      ctx.response.status = 200;
    } else {
      ctx.response.status = 400;
    }
  });

  router.post("/shop/redact", async (ctx) => {
    if (verifyWebhook(ctx)) {
      ctx.response.status = 200;
    } else {
      ctx.response.status = 401;
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest);
  router.use("/shop", shopRouter.routes());
  router.use("/store", storeRouter.routes());
  // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    console.log("Request Query Shop Logged", shop);
    setName(shop);
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });
  //router.use("/shop", shopRouter.routes());
  //router.use("/store", storeRouter.routes());

  server.use(
    cors({
      origin: function (ctx) {
        return "*";
      },
    })
  );

  server.use(async (ctx, next) => {
    // const { shop } = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    ctx.set(
      "Content-Security-Policy",
      `frame-ancestors https://${shop_name} https://admin.shopify.com `
    );
    await next();
  });

  server.use(bodyParser());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
