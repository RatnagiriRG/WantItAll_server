const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRECT_KEY, { expiresIn: "1d" });
};

module.exports = { generateRefreshToken };
