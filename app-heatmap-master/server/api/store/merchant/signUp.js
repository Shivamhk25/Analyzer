import Router from "koa-router";
import Merchant from "../../../models/merchant";

const router = Router();

router.post("/", async (ctx) => {
  try {
    const { email, shop, name, password } = ctx.request.body;
    const checkUser = await Merchant.findOne({ email });
    if (checkUser) {
      ctx.response.status = 404;
      ctx.response.body = "This is Email Already Exists. Try Log In instead";
    } else {
      const merch = new Merchant({
        name: name,
        shop: shop,
        email: email,
        password: password,
      });
      await merch.save();
      ctx.response.status = 200;
      ctx.response.body = "Merchant Registered Sucessfully";
    }
  } catch (err) {
    console.log(err);
    ctx.response.status = 400;
    ctx.response.body = err;
  }
});

export default router;
