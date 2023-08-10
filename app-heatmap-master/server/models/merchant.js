import { Schema, model } from "mongoose";

const merchantSchema = new Schema({
  shop: String,
  name: String,
  email: String,
  accessToken: String,
  password: {
    type: String,
  },
  settings: {
    analytics: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: true,
    },
  },
  privacy: {
    extreme: {
      type: Boolean,
      default: false,
    },
    controls: {
      type: [String],
      default: ["key", "mouse", "movements", "scrolls", "ip"],
    },
  },
  record: {
    type: Boolean,
    default: true,
  },
  scrambleText: {
    type: Boolean,
    default: true,
  },
  blocked: [String],
  authToken: String,
  uninstall: Boolean,
  read_instructions: { type: Boolean, default: false },
});

const Merchant = model("Merchant", merchantSchema);

export default Merchant;
