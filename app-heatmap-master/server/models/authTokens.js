import { Schema, model } from "mongoose";
const authTokenSchema = new Schema(
  {
    sessionId: String,
    token: String,
  },
  { timestamps: true }
);
authTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const AuthToken = model("authTokens", authTokenSchema);

export default AuthToken;
