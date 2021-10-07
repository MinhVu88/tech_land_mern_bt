const { validationResult } = require("express-validator"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcryptjs"),
  config = require("config"),
  UserModel = require("../models/User");

const getUserByToken = async (req, res, next) => {
  const authUser = req.user;

  try {
    const user = await UserModel.findById(authUser.id).select("-password");

    res.json(user);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const authenticateUser = async (req, res, next) => {
  console.log(
    "req.body (post | routes/api/auth | authController) ->",
    req.body
  );

  const errors = validationResult(req),
    { email, password } = req.body;

  // if there are errors, set the status code as 400 & respond with error messages as json
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // check if a user exists in the db by email
    let user = await UserModel.findOne({ email });

    // check if a user's email & password are valid
    // if not, set status code as 400 & an array of error messages
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
    }

    // compare a plain-text password to a hashed one retrieved from the db
    const samePasswords = await bcrypt.compare(password, user.password);

    if (!samePasswords) {
      return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
    }

    // return jsonwebtoken
    const payload = {
      user: { id: user.id }
    };

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

module.exports = { getUserByToken, authenticateUser };
