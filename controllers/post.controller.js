const Post = require("../models/Post");

//get all posts
exports.getPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate("user", "profileImage")
    .sort({ createdAt: -1 })
  return res.status(200).json(posts);
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
      .populate("user", "profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "profileImage",
        },
      });
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(500).json({
        errors: "post not found",
      });
    }
  } catch (error) {
    return res.status(501).json({
      errors: error,
    });
  }
};

//get posts of single user
exports.userPosts = async (req, res) => {
  const username = req.params.username;
  const getUserPosts = await Post.find({ username })
    .populate("user", "profileImage")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "profileImage",
      },
    });
  try {
    if (getUserPosts) {
      return res.status(200).json(getUserPosts);
    } else {
      return res.status(500).json("user not found");
    }
  } catch (error) {
    res.status(501).json(error);
  }
};

//update post of owner
exports.updatePost = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const { body } = req.body;

  const getpost = async () => {
    const post = await Post.findById(postId).populate("user", "profileImage");
    return post;
  };

  try {
    const post = await getpost();
    if (post.username === user.username) {
      const postUpdate = await post.updateOne({ body: body });
      return res.status(200).json(await getpost());
    } else {
      return res.status(400).json({
        errors: "You are not post owner",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


//create post
exports.createPost = async (req, res) => {
  const user = req.user;
  const body = req.body.body;
  if (body.trim() === "") {
    return res.status(501).json({
      errors: "body must not be empty",
    });
  }
  const newPost = new Post({
    body,
    username: user.username,
    user: user.id,
  });
  try {
    await newPost.save();
    await newPost.populate("user", "profileImage");

    return res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({
      errors: error,
    });
  }
};


//delete post of owner
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
