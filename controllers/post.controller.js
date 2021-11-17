const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  return res.status(200).json(posts);
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId)
    if (post) {
      return res.status(200).json(post)
    } else {
      return res.status(500).json({
        errors: "post not found"
      })
    }
  } catch (error) {
    return res.status(501).json({
      errors: error
    })
  }

}

exports.createPost = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      errors: "You are not authenticated",
    });
  }
  const body = req.body.body
  if (body.trim() === ""){
    return res.status(501).json({
      errors: "body must not be empty"
    })
  }
  const newPost = new Post({
    body,
    username: user.username,
    user: user.id,
  });
  try {
    await newPost.save();
    return res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({
      errors: error,
    });
  }
};

exports.deletePost = async (req, res) => {
  const user = req.user;

  const postId = req.query.postid;

  const post = await Post.findById(postId);
  if (post) {
    if (post.username === user.username) {
      await post.delete();
      return res.status(200).json("successfully deleted");
    }
    return res.status(400).json({
      errors: "function is not permitted",
    });
  }
  return res.status(400).json({
    errors: "Post not found",
  });
};


