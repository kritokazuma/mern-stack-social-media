const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  participants: {
    user1: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
    user2: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
  },
  messages: [
    {
      sender: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  total_message: Number,
});

module.exports = mongoose.model("Message", messagesSchema);
