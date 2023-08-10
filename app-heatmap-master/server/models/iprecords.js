import { Schema, model } from "mongoose";
const ipRecords = new Schema(
  {
    ip: String,
    hostname: String,
    city: String,
    region: String,
    country: String,
    loc: String,
    org: String,
    postal: String,
    timezone: String,
  },
  { timestamps: true }
);

const IpRecords = model("ipRecords", ipRecords);

export default IpRecords;
