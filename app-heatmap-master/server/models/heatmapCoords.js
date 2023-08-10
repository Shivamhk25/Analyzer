import { Schema, model } from "mongoose";
const heatMapCoordsSchema = new Schema(
  {
    merchantId: String,
    userSessionId: String,
    sessionId: String,
    url: String,
    screenSize: String,
    mapId: String,
    coords: [[Number, Number]],
  },
  { timestamps: true }
);

const HeatMapCoords = model("heatMapCoords", heatMapCoordsSchema);

export default HeatMapCoords;
