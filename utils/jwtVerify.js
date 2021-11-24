const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verify = async (req, res, next) => {
  try {
    //req token from headers and split bearer
    const token = req.headers.authorization.split(" ")[1];

    //verify requested token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    //check token is valid or not
    if (!token || !decodedToken.id || !user) {
      return res.status(400).json({
        errors: "Token missing or invalid",
      });
    }
    req.user = decodedToken;
    next()
  } catch (error) {
    return res.status(401).json({
      error: "Token missing or invalid"
    });
  }
};
