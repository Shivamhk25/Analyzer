import Router from "koa-router";
import Merchant from "../../../models/merchant";

const router = Router();

router.post("/", async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    const checkUser = await Merchant.findOne({ email: email });
    if (!checkUser) {
      ctx.response.status = 404;
      ctx.response.body = "No User with this email Exists";
    } else {
      if (checkUser.password == password) {
        ctx.response.status = 200;
        ctx.response.body = "Logged In Sucessfully";
      } else {
        ctx.response.status = 404;
        ctx.response.body = "Invalid Credentials";
      }
    }
  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = err;
  }
});

export default router;
