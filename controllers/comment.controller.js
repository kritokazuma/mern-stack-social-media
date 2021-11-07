const Post = require("../models/Post");

exports.createComment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const post = await Post.findById(postId);

  if (post) {
    post.comments.unshift({
      body: req.body.body,
      username: user.username,
      createdAt: new Date().toISOString(),
    });
    await post.save();
    return res.status(200).json(post);
  }
  return res.status(500).json({
    errors: "Post not found",
  });
};

exports.deleteComment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const { commentid } = req.query;
  try {
    const post = await Post.findById(postId);
    if (post) {
      const commentIndex = post.comments.findIndex((c) => c.id === commentid);
      if (post.comments[commentIndex].username === user.username) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return res.status(200).json(post);
      } else {
        return res.status(500).json({
          errors: "Function is not permitted",
        });
      }
    } else {
      return res.status(500).json({
        errors: "Comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      errors: error,
    });
  }
};
