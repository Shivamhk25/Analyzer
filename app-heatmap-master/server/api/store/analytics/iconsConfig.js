import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";
import { countries } from "country-flags-svg";

const router = Router();

router.get("/flag-data", async (ctx) => {
  try {
    const flagData = countries;
    ctx.response.status = 200;
    ctx.response.body = flagData;
  } catch (e) {
    ctx.response.status = 404;
    ctx.response.body = e;
  }
});

const iconData = {
  macOS: "",
  Safari: "",
  Android: "",
  IOS: "",
  Windows: "",
  Chrome: "",
  FireFox: "",
  Brave: "",
};

router.get("/icon-data", async (ctx) => {
  try {
    ctx.response.status = 200;
    ctx.response.body = iconData;
  } catch (e) {
    ctx.response.status = 404;
    ctx.response.body = e;
  }
});

export default router;
