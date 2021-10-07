const { validationResult } = require("express-validator"),
  config = require("config"),
  axios = require("axios"),
  ProfileModel = require("../models/Profile"),
  UserModel = require("../models/User"),
  PostModel = require("../models/Post");

const getCurrentProfile = async (req, res, next) => {
  console.log(
    "\nreq.user (get | routes/api/profile/me | profileController) ->",
    req.user
  );

  const authUser = req.user;

  try {
    const profile = await ProfileModel.findOne({
      user: authUser.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "no profile found for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const createProfile = async (req, res, next) => {
  const authUser = req.user;

  console.log(
    "\nreq.body (post | routes/api/profile | profileController) ->",
    req.body
  );

  // validate errors & destructure the profile fields from req.body
  // for education & workExperience fields, there are separate routes/endpoints to create them
  const errors = validationResult(req),
    {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // check if each profile field is accordingly provided by user
  // before the fields are added to the db
  // 1st, build a profile object, whose properties are the fields
  const profileFields = {};

  profileFields.user = authUser.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubUsername) profileFields.githubUsername = githubUsername;
  if (skills) {
    // turn a comma-separated string/list of skills (with or without spaces)
    // provided by user into an array of skills by calling split(',') on the string
    // split() makes the string an array whose elements are trimmed off
    // of any white spaces surrounding them by calling map() on the array
    profileFields.skills = skills.split(",").map(skill => skill.trim());
  }

  console.log(
    "\nprofileFields.skills (post | routes/api/profile | profileController) ->",
    profileFields.skills
  );

  // 2nd, build a social object
  profileFields.social = {};

  if (youtube) profileFields.social.youtube = youtube;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;

  console.log(
    "\nprofileFields (post | routes/api/profile | profileController) ->",
    profileFields
  );

  try {
    // find a corresponding profile in the db
    let profile = await ProfileModel.findOne({ user: authUser.id });

    // if a profile's found, then update it & return the updated version
    if (profile) {
      profile = await ProfileModel.findOneAndUpdate(
        { user: authUser.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // if profile's not found, create a new ProfileModel instance using profileFields,
    // save the instance to the db & return it as a json response
    profile = new ProfileModel(profileFields);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await ProfileModel.find().populate("user", [
      "name",
      "avatar"
    ]);

    res.json(profiles);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getProfileByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const profile = await ProfileModel.findOne({
      user: userId
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    // even if userId is invalid (Ex: the length's greater/less than a valid/nonexistent one),
    // the error msg is still "profile not found", instead of "server error"
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }

    res.status(500).send("server error");
  }
};

const deleteProfile = async (req, res, next) => {
  const authUser = req.user;

  try {
    // delete user posts
    await PostModel.deleteMany({ user: authUser.id });

    // delete an auth profile
    await ProfileModel.findOneAndRemove({ user: authUser.id });

    // delete an auth user/account
    await UserModel.findByIdAndRemove({ _id: authUser.id });

    res.json({ msg: "user account removed" });
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const addWorkXperienceToProfile = async (req, res, next) => {
  // validate errors & destructure the workExperience fields from req.body
  const authUser = req.user,
    errors = validationResult(req),
    { title, company, location, from, to, current, description } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // the newWorkXperience object contains the submitted data by user on the front-end
  const newWorkXperience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };

  // add/update the work experiences to the db
  try {
    const profile = await ProfileModel.findOne({ user: authUser.id });

    // profile.workExperience is an array &
    // unshift() pushes a new work experience to the start of the array
    // thus, a user's most recent work will appear 1st, on top of other old ones
    profile.workExperience.unshift(newWorkXperience);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const deleteWorkXperienceFromProfile = async (req, res, next) => {
  try {
    const authUser = req.user,
      removedExpId = req.params.expId,
      profile = await ProfileModel.findOne({ user: authUser.id }),
      experiences = profile.workExperience,
      removedExperience = experiences.filter(e => e.id === removedExpId),
      removedIndex = experiences.indexOf(removedExperience[0].id);

    console.log(
      "\nremovedExperience (delete | routes/api/profile/experience/:expId | profileController) ->",
      removedExperience
    );

    // remove the work experience, whose id is attached to the endpoint
    experiences.splice(removedIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const addEduToProfile = async (req, res, next) => {
  const authUser = req.user,
    errors = validationResult(req),
    { school, degree, fieldOfStudy, from, to, current, description } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newEdu = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  };

  try {
    const profile = await ProfileModel.findOne({ user: authUser.id });

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const deleteEduFromProfile = async (req, res, next) => {
  try {
    const authUser = req.user,
      removedEduId = req.params.eduId,
      profile = await ProfileModel.findOne({ user: authUser.id }),
      edu = profile.education,
      removedEdu = edu.filter(e => e.id === removedEduId),
      removedIndex = edu.indexOf(removedEdu[0].id);

    console.log(
      "\nremovedEdu (delete | routes/api/profile/edu/:eduId | profileController) ->",
      removedEdu
    );

    edu.splice(removedIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getUserGithubRepos = async (req, res, next) => {
  const username = req.params.username,
    githubClientId = config.get("githubClientId"),
    githubSecret = config.get("githubSecret");

  try {
    const uri = encodeURI(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubSecret}`
      ),
      headers = { "User-Agent": "DevConnectorMern" },
      gitHubResponse = await axios.get(uri, { headers });

    res.json(gitHubResponse.data);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

module.exports = {
  getCurrentProfile,
  createProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteProfile,
  addWorkXperienceToProfile,
  deleteWorkXperienceFromProfile,
  addEduToProfile,
  deleteEduFromProfile,
  getUserGithubRepos
};
