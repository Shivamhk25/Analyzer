import { Schema, model } from "mongoose";
const liveUserSchema = new Schema(
  {
    liveId: String,
    userid: String,
    merchantId: String,
  },
  { timestamps: true }
);
liveUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });

const LiveUser = model("liveUser", liveUserSchema);

export default LiveUser;
