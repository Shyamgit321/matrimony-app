const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,

  edited: {
    type: Boolean,
    default: false
  },

  seen: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);