const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const jwtSecretKey = "thisismysecretkey";

const authMiddleWare = async (req, res, next) => {
  //   console.log(req.headers);
  const token = req.headers.authorization;
  console.log(token);
  if (!token)
    return res
      .status(404)
      .json({ success: false, message: "please login first" });
  try {
    jwt.verify(token, jwtSecretKey);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "invalid jwt",
    });
  }
  const decodedToken = jwt.decode(token);
  console.log(decodedToken);
  const tokenExp = decodedToken.exp;
  const now = Math.floor(Date.now() / 1000);
  if (now > tokenExp) {
    return res.status(404).json({ success: false, message: "session expired" });
  }
  const user = await User.findById(decodedToken._id);

  if (!user.token || user.token !== token)
    return res.json({ success: false, message: "Invalid JWT" });
  req.user = user;
  next();
};
module.exports = authMiddleWare;
