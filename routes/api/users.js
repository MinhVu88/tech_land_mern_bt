const express = require("express"),
  router = express.Router(),
  { check } = require("express-validator"),
  userController = require("../../controllers/userController");

/**
 * @route POST api/users
 * @desc Register user
 * @access Public
 */
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required & must be valid/unique").isEmail(),
    check(
      "password",
      "Password is required & must be at least 6 characters in length"
    ).isLength({ min: 6 })
  ],
  userController.registerUser
);

/**
 * @route GET api/users
 * @desc Get all registered users
 * @access Public
 */
router.get("/", userController.getRegisteredUsers);

module.exports = router;
