const express = require("express");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const Call = require("../models/Call");

const router = express.Router();

router.post("/start", auth, async (req, res) => {
  try {
    const { partnerId } = req.body;
    if (!partnerId) return res.status(400).json({ message: "Partner is required." });

    const roomId = crypto.randomUUID();
    const call = await Call.create({
      caller: req.user.id,
      partner: partnerId,
      roomId
    });

    res.status(201).json({ callId: call._id, roomId });
  } catch {
    res.status(500).json({ message: "Could not start call." });
  }
});

router.post("/:id/end", auth, async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) return res.status(404).json({ message: "Call not found." });

    const endedAt = new Date();
    call.endedAt = endedAt;
    call.durationSeconds = Math.max(0, Math.round((endedAt - call.startedAt) / 1000));
    call.status = "completed";
    await call.save();

    res.json({ message: "Call ended.", durationSeconds: call.durationSeconds });
  } catch {
    res.status(500).json({ message: "Could not end call." });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user.id }, { partner: req.user.id }]
    }).populate("caller partner", "name role rating").sort({ createdAt: -1 }).limit(50);

    res.json({ calls });
  } catch {
    res.status(500).json({ message: "Could not load call history." });
  }
});

module.exports = router;
