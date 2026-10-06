const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ message: "User not found." });

    const desiredRole = me.role === "beginner" ? "fluent" : "beginner";
    const filter = {
      _id: { $ne: me._id, $nin: me.blockedUsers || [] },
      role: desiredRole
    };

    if (me.partnerGender && me.partnerGender !== "any") {
      filter.gender = me.partnerGender;
    }

    let partner = await User.findOne(filter).sort({ isOnline: -1, rating: -1 });
    if (!partner) return res.status(404).json({ message: "No compatible partner is available right now." });

    res.json({
      partner: {
        id: partner._id,
        name: partner.name,
        role: partner.role,
        gender: partner.gender,
        rating: partner.rating
      }
    });
  } catch {
    res.status(500).json({ message: "Matching failed." });
  }
});

module.exports = router;
