const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.validateToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    if (!token || !decodedToken.id || !user) {
      throw new Error("validation error");
    }
    return decodedToken;
  } catch (error) {
    throw new Error(error);
  }
};
