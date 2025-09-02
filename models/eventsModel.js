import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  datetime: { type: Date, default: Date.now },
  signalName: { type: String, required: true },
  value: { type: Number, enum: [0, 1], required: true },
  errorType: { type: String, default: null } // only filled for error events
});

export default mongoose.model("Event", eventSchema);
