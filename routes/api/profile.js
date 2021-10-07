const express = require("express"),
  router = express.Router(),
  { check } = require("express-validator"),
  authMiddleware = require("../../middleware/auth"),
  profileController = require("../../controllers/profileController");

/**
 * @route GET api/profile/me
 * @desc Get current auth profile
 * @access Private
 */
router.get("/me", authMiddleware, profileController.getCurrentProfile);

/**
 * @route POST api/profile
 * @desc Create/update auth profile
 * @access Private
 */
router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty()
    ]
  ],
  profileController.createProfile
);

/**
 * @route GET api/profile
 * @desc Get all auth profiles
 * @access Public
 */
router.get("/", profileController.getAllProfiles);

/**
 * @route GET api/profile/user/:userId
 * @desc Get auth profile by userId
 * @access Public
 */
router.get("/user/:userId", profileController.getProfileByUserId);

/**
 * @route DELETE api/profile
 * @desc Delete auth profile, user & posts
 * @access Private
 */
router.delete("/", authMiddleware, profileController.deleteProfile);

/**
 * @route PUT api/profile/experience
 * @desc Add work experiences to auth profile (updating part of the whole profile)
 * @access Private
 */
router.put(
  "/experience",
  [
    authMiddleware,
    [
      check("title", "Work title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "Starting date is required").not().isEmpty()
    ]
  ],
  profileController.addWorkXperienceToProfile
);

/**
 * @route DELETE api/profile/experience/:expId
 * @desc Delete work experience from auth profile
 * @access Private
 */
router.delete(
  "/experience/:expId",
  authMiddleware,
  profileController.deleteWorkXperienceFromProfile
);

/**
 * @route PUT api/profile/edu
 * @desc Add education to auth profile (updating part of the whole profile)
 * @access Private
 */
router.put(
  "/edu",
  [
    authMiddleware,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "Field of study is required").not().isEmpty(),
      check("from", "Starting date is required").not().isEmpty()
    ]
  ],
  profileController.addEduToProfile
);

/**
 * @route DELETE api/profile/edu/:eduId
 * @desc Delete education from auth profile
 * @access Private
 */
router.delete(
  "/edu/:eduId",
  authMiddleware,
  profileController.deleteEduFromProfile
);

/**
 * @route GET api/profile/github/:username
 * @desc Get user repos from github
 * @access Public
 */
router.get("/github/:username", profileController.getUserGithubRepos);

module.exports = router;
