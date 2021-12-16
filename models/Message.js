const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  participants: [mongoose.Types.ObjectId],
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
