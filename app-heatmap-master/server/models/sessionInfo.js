import { Schema, model } from "mongoose";

const sessionInfoSchema = new Schema({
  merchantId: String,
  sessionId: String,
  authTokens: Array,
  browser: String,
  ipInfo: String,
  osInfo: String,
  userActivity: String,
  path: String,
  url: String,
  isp: String,
  timestamp: Date,
  recording: [],
  created: Date,
  updated: Date,
  pgurl: [],
  location: String,
  isBlockIp: Boolean,
  countryCode: String,
  cartValue: Number, // amount in cart
  purchaseValue: Number, //total amount of products bought
});

const SessionInfo = model("SessionInfo", sessionInfoSchema);

export default SessionInfo;
