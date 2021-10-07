const { validationResult } = require("express-validator"),
  gravatar = require("gravatar"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  config = require("config"),
  UserModel = require("../models/User");

const registerUser = async (req, res, next) => {
  console.log(
    "\nreq.body (post | routes/api/users | userController) ->",
    req.body
  );

  const errors = validationResult(req),
    { name, email, password } = req.body;

  // if there are errors, set the status code as 400 & respond with error messages as json
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // check if a user exists in the db by email
    let user = await UserModel.findOne({ email });

    // check for duplicate users
    // with duplicate users, set status code as 400 & an array of error messages
    if (user) {
      return res.status(400).json({ errors: [{ msg: "user already exists" }] });
    }

    // get user gravatar
    const avatar = gravatar.url(email, {
      size: "200",
      rating: "pg",
      default: "mm"
    });

    // with no duplicate users, create a new instance of the User model,
    // which hasn't been saved to the db yet
    user = new UserModel({ name, email, avatar, password });

    // encrypt password & hash it
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // save the user model instance to the db as a document in the users collection
    await user.save();

    // return jsonwebtoken
    const payload = {
      user: { id: user.id }
    };

    console.log("\npayload in jwt.sign() (userController) ->", payload);

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;

        // without errors, send the token back to the registered user for auth
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getRegisteredUsers = async (req, res, next) => {
  try {
    const authUsers = await UserModel.find({});

    res.status(200).json(authUsers);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

module.exports = { registerUser, getRegisteredUsers };
