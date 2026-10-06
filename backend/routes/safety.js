const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Report = require("../models/Report");

const router = express.Router();

router.post("/block", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User is required." });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { blockedUsers: userId } });
    res.json({ message: "User blocked." });
  } catch {
    res.status(500).json({ message: "Could not block user." });
  }
});

router.post("/report", auth, async (req, res) => {
  try {
    const { userId, reason, details } = req.body;
    if (!userId || !reason) return res.status(400).json({ message: "User and reason are required." });

    await Report.create({
      reporter: req.user.id,
      reportedUser: userId,
      reason,
      details: details || ""
    });

    res.json({ message: "Report received. Thank you for helping keep the community safe." });
  } catch {
    res.status(500).json({ message: "Could not submit report." });
  }
});

module.exports = router;
