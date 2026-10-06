const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["beginner", "fluent"], default: "beginner" },
  gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"], default: "prefer_not_to_say" },
  partnerGender: { type: String, enum: ["any", "male", "female", "other"], default: "any" },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isOnline: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
