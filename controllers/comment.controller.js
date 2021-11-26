const Post = require("../models/Post");

//Create comment
exports.createComment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const post = await Post.findById(postId).populate({
    path: "comments",
    populate: {
      path: "user",
      select: "profileImage",
    },
  });

  if (post) {
    post.comments.unshift({
      body: req.body.body,
      username: user.username,
      createdAt: new Date().toISOString(),
      user: user.id,
    });
    await post.save();
    await post.populate({
      path: "comments",
      populate: {
        path: "user",
        select: "profileImage",
      },
    });
    return res.status(200).json(post);
  }
  return res.status(500).json({
    errors: "Post not found",
  });
};

//Delete comment
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

//edit comment
exports.editComment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const { commentid } = req.query;
  const { body } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post) {
      if (
        post.comments.find(
          (comment) =>
            comment.username === user.username && comment.id === commentid
        )
      ) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentid
        );
        post.comments[commentIndex].body = body;
        await post.save();
        return res.status(200).json(post);
      }
      return res.status(500).json("comment can't delete");
    } else {
      return res.status(500).json("post not found");
    }
  } catch (error) {
    return res.status(501).json(error);
  }
};
