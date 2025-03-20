const jwt = require("jsonwebtoken");

const setCookie = async (res, user) => {
  const token = await jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );

  const options = {};
  res.cookie("token", token, options);
  return token;
};

module.exports = setCookie;
