const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verify = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    if (!token || !decodedToken.id || !user) {
      return res.status(400).json({
        errors: "Token missing or invalid",
      });
    }
    req.user = decodedToken;
    next()
  } catch (error) {
    return res.status(400).json({
      errors: error,
    });
  }
};
