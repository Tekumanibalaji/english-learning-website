const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Rating = require("../models/Rating");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { to, rating, feedback, call } = req.body;
    const value = Number(rating);
    if (!to || !Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: "A rating from 1 to 5 is required." });
    }
    if (String(to) === String(req.user.id)) {
      return res.status(400).json({ message: "You cannot rate yourself." });
    }

    await Rating.create({ from: req.user.id, to, rating: value, feedback: feedback || "", call });

    const target = await User.findById(to);
    const newCount = (target.ratingCount || 0) + 1;
    target.rating = (((target.rating || 0) * (newCount - 1)) + value) / newCount;
    target.ratingCount = newCount;
    await target.save();

    res.json({ message: "Rating submitted.", rating: target.rating });
  } catch {
    res.status(500).json({ message: "Could not submit rating." });
  }
});

module.exports = router;
