const router = require("express").Router();
const {
  getPosts,
  createPost,
  deletePost,
  getSinglePost,
  updatePost,
} = require("../controllers/post.controller");
const {
  createComment,
  deleteComment,
  editComment,
} = require("../controllers/comment.controller");
const { likePost } = require("../controllers/like.controller");

const { verify } = require("../utils/jwtVerify");

router
  .route("/posts")
  //get all posts
  .get(getPosts)

  //delete post
  .delete(verify, deletePost)

  //like post
  .post(verify, likePost);

router.route("/posts/createpost").post(verify, createPost);

router
  .route("/posts/:postId")

  //create comment
  .post(verify, createComment)

  //delete comment
  .delete(verify, deleteComment)

  //get specific post
  .get(getSinglePost)

  //update post
  .put(verify, updatePost)

  .patch(verify, editComment)

module.exports = router;
