const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true, maxlength: 100 },
  details: { type: String, maxlength: 1000, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
