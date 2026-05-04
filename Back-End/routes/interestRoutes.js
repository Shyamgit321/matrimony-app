const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const Interest = require("../models/Interest");
const User = require("../models/User");

/* ===============================
SEND INTEREST
=============================== */
router.post("/send", protect, async (req, res) => {
  try {
    const { to } = req.body;

    // check existing
    const existing = await Interest.findOne({
      from: req.user.id,
      to
    });

    if (existing) {
      return res.json({ status: "exists" });
    }

    const interest = await Interest.create({
      from: req.user.id,
      to
    });

    res.json({ status: "sent", interest });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
CHECK INTEREST STATUS
=============================== */
router.get("/check/:id", protect, async (req, res) => {
  try {
    const to = req.params.id;

    const interest = await Interest.findOne({
      from: req.user.id,
      to
    });

    if (interest) {
      return res.json({
        status: "sent",
        id: interest._id
      });
    }

    res.json({ status: "none" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
DELETE (UNSEND)
=============================== */
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({ message: "Not found" });
    }

    if (interest.from.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await interest.deleteOne();

    res.json({ status: "removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ===============================
RECEIVED (for chat-list)
=============================== */
router.get("/received", protect, async (req, res) => {
  try {
    const list = await Interest.find({ to: req.user.id })
      .populate("from", "name profileImage");

    const formatted = list.map(i => ({
      userId: i.from._id,
      name: i.from.name,
      image: i.from.profileImage,
      time: i.createdAt,
      type: "interest"
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;