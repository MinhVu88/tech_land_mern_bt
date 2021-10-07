const express = require("express"),
  router = express.Router(),
  { check } = require("express-validator"),
  authMiddleware = require("../../middleware/auth"),
  postController = require("../../controllers/postController");

/**
 * @route POST api/posts
 * @desc Create a post
 * @access Private
 */
router.post(
  "/",
  [
    authMiddleware,
    [check("content", "Post must not be blank").not().isEmpty()]
  ],
  postController.createPost
);

/**
 * @route GET api/posts
 * @desc Get all posts
 * @access Private
 */
router.get("/", authMiddleware, postController.getAllPosts);

/**
 * @route GET api/posts/:postId
 * @desc Get post by id
 * @access Private
 */
router.get("/:postId", authMiddleware, postController.getPostById);

/**
 * @route DELETE api/posts/:postId
 * @desc Delete post by id
 * @access Private
 */
router.delete("/:postId", authMiddleware, postController.deletePostById);

/**
 * @route PUT api/posts/like/:postId
 * @desc Like post by id
 * @access Private
 */
router.put("/like/:postId", authMiddleware, postController.likePostById);

/**
 * @route PUT api/posts/unlike/:postId
 * @desc Unlike post by id
 * @access Private
 */
router.put("/unlike/:postId", authMiddleware, postController.unlikePostById);

/**
 * @route POST api/posts/comment/:postId
 * @desc Comment on a post
 * @access Private
 */
router.post(
  "/comment/:postId",
  [
    authMiddleware,
    [check("content", "Comment must not be blank").not().isEmpty()]
  ],
  postController.commentOnPost
);

/**
 * @route DELETE api/posts/comment/:postId/:commentId
 * @desc Remove comment of a post
 * @access Private
 */
router.delete(
  "/comment/:postId/:commentId",
  authMiddleware,
  postController.deletePostComment
);

module.exports = router;
