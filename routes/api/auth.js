const express = require("express"),
  router = express.Router(),
  { check } = require("express-validator"),
  authMiddleware = require("../../middleware/auth"),
  authController = require("../../controllers/authController");

/**
 * @route GET api/auth
 * @desc Get user by token
 * @access Private
 */
router.get("/", authMiddleware, authController.getUserByToken);

/**
 * @route POST api/auth
 * @desc Authenticate user & get token to make requests to protected routes
 * @access Public
 */
router.post(
  "/",
  [
    check("email", "Email is required & must be valid/unique").isEmail(),
    check("password", "Password is required").exists()
  ],
  authController.authenticateUser
);

module.exports = router;
