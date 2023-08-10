import { Schema, model } from "mongoose";

const membershipSchema = new Schema({
  merchant_id: String,
  membership_plan: { type: String, default: "Free Plan" },
  max_page_views: { type: Number, default: 500 },
  max_days_retention: { type: Number, default: 30 },
  expiry_date: { type: Date, default: "2022-01-08T13:37:34+05:30" },
  status: { type: String, default: "deactive" },
  created: { type: Date, default: "2022-01-08T13:37:34+05:30" },
  updated: { type: Date, default: "2022-01-08T13:37:34+05:30" },
});

const Membership = model("Membership", membershipSchema);

export default Membership;
