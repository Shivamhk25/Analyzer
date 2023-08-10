import { Schema, model } from "mongoose";

const blockedSchema = new Schema({
  merchantId: String,
  ipAddress: String,
});

const BlockedIp = model("BlockedIp", blockedSchema);

export default BlockedIp;
