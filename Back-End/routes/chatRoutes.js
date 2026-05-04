const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const User = require("../models/User");

/* =====================================
SEND MESSAGE (SAVE IN DB)
===================================== */
router.post("/send", protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const newMsg = await Chat.create({
      sender: req.user.id,
      receiver: receiverId,
      text
    });

    res.json(newMsg);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =====================================
EDIT MESSAGE
===================================== */
router.put("/edit/:id", protect, async (req, res) => {
  try {
    const msg = await Chat.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can edit
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    msg.text = req.body.text;
    msg.edited = true;

    await msg.save();

    res.json(msg);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =====================================
DELETE MESSAGE
===================================== */
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const msg = await Chat.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await msg.deleteOne();

    res.json({ message: "Message deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =====================================
GET CHAT HISTORY (1-1)
===================================== */
router.get("/:id", protect, async (req, res) => {
  try {
    const otherUserId = req.params.id;

    const messages = await Chat.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* =====================================
GET CHAT LIST (INBOX)
===================================== */
router.get("/list/all", protect, async (req, res) => {
  try {

    const chats = await Chat.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).sort({ updatedAt: -1 });

    const userMap = {};

    for (let chat of chats) {
      const otherId =
        chat.sender.toString() === req.user.id
          ? chat.receiver
          : chat.sender;

      if (!userMap[otherId]) {
        const user = await User.findById(otherId).select("name profileImage");

        userMap[otherId] = {
          userId: otherId,
          name: user?.name || "User",
          image: user?.profileImage || "",
          lastMessage: chat.text,
          time: chat.createdAt
        };
      }
    }

    res.json(Object.values(userMap));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =====================================
MARK AS SEEN
===================================== */
router.put("/seen/:id", protect, async (req, res) => {
  try {
    const otherUserId = req.params.id;

    await Chat.updateMany(
      {
        sender: otherUserId,
        receiver: req.user.id,
        seen: false
      },
      {
        seen: true
      }
    );

    res.json({ message: "Seen updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;