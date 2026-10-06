const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  call: { type: mongoose.Schema.Types.ObjectId, ref: "Call" },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, maxlength: 500, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Rating", RatingSchema);
