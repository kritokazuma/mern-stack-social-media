const router = require("express").Router();
const {
  getPosts,
  createPost,
  deletePost,
  getSinglePost,
} = require("../controllers/post.controller");
const {
  createComment,
  deleteComment,
} = require("../controllers/comment.controller");
const { likePost } = require("../controllers/like.controller");

const { verify } = require("../utils/jwtVerify");

router
  .route("/posts")
  .get(getPosts)
  .delete(verify, deletePost)
  .post(verify, likePost);

router.route("/posts/createpost").post(verify, createPost);

router
  .route("/posts/:postId")
  .post(verify, createComment)
  .delete(verify, deleteComment)
  .get(getSinglePost);

module.exports = router;
