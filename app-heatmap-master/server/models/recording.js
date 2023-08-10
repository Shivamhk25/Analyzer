import { Schema, model } from "mongoose";

const recordingInfoSchema = new Schema({
  merchantId: String,
  recId: String,
  recording: String,
  created: Date,
  updated: Date,
  isp: String,
});

const RecordingInfo = model("recordingInfo", recordingInfoSchema);

export default RecordingInfo;
