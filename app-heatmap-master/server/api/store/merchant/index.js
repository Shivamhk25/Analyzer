import Router from "koa-router";
import Shopify from "@shopify/shopify-api";
import { verifyRequest } from "@shopify/koa-shopify-auth";

import MerchantSignUp from "./signUp";
import MerchantLogIn from "./logIn";

const router = Router();

router.use("/login", MerchantLogIn.routes());
router.use("/sign-up", MerchantSignUp.routes());

export default router;
