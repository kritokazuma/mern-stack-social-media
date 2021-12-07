const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: String,
    username: String,
    profileImage: String,
    comments: [
      {
        body: String,
        username: String,
        profileImage: String,
        createdAt: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    likes: [
      {
        username: String,
        createdAt: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
