import { Schema, model } from "mongoose";
const cookieSchema = new Schema(
  {
    cookieId: String,
    shop: String,
    merchantID: String,
  },
  { timestamps: true }
);
cookieSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
const Cookie = model("cookies", cookieSchema);

export default Cookie;
