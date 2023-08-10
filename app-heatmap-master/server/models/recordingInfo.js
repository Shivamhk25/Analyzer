import { Schema, model } from "mongoose";

const recordingSchema = new Schema({
  merchantId: String,
  recId: String,
  sessionId: String,
  ipInfo: String,
  ispInfo: String,
  location: String,
  pages: String,
  tags: [String],
  source: String,
  browser: String,
  pageurl: [],
  count: Number,
  startTime: Number,
  endTime: Number,
  device: String,
  timeDuration: String,
  created: Date,
  updated: Date,
});

const Recording = model("Recording", recordingSchema);

export default Recording;
