const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  durationSeconds: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Call", CallSchema);
