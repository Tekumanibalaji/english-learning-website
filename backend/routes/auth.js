const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    gender: user.gender,
    partnerGender: user.partnerGender,
    rating: user.rating
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, role, gender, partnerGender } = req.body;
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "Name, email, mobile and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must contain at least 8 characters." });
    }

    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) return res.status(409).json({ message: "Email or mobile is already registered." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, mobile, passwordHash,
      role: role === "fluent" ? "fluent" : "beginner",
      gender, partnerGender
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.isOnline = true;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
