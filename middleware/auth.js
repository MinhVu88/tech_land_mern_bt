const jwt = require("jsonwebtoken"),
  config = require("config");

const authMiddleware = (req, res, next) => {
  // when a req is sent to a protected route, the token needs to be included within the req header
  const token = req.header("x-auth-token");

  // if no token's found in the header, user is unauthorized to access a protected route
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }

  console.log("\nunverified token (authMiddleware) ->", token);

  try {
    // verify the token if there's one
    const verifiedToken = jwt.verify(token, config.get("jwtSecret"));

    console.log("\nverified token (authMiddleware) ->", verifiedToken);

    // assign the user object in verifiedToken to the user property of the req object
    // then req.user can be used in any routes including protected/private ones
    req.user = verifiedToken.user;

    console.log("\nreq.user (authMiddleware) ->", req.user);

    // next() is called to move on to the next middleware
    next();
  } catch (error) {
    // if there's a token but it's invalid, then catch() runs
    res.status(401).json({ msg: "invalid token" });
  }
};

module.exports = authMiddleware;
