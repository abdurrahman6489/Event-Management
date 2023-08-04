const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const validateRegistrationData = require("../validations/registervalidation.js");
const logger = require("../Utils/logger.js");
const jwtsecretKey = "thisismysecretkey";
const SESSION_TIME_SECONDS = 3600;

const registerUser = async (req, res) => {
  //   const userBody = req.body;

  const { name, email } = req.body;
  const plainTextPassword = req.body.password;
  const error = validateRegistrationData(name, email, plainTextPassword);
  if (error.hasError) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
  const user = await User.findOne({ email: email });
  if (user)
    return res
      .status(404)
      .json({
        success: false,
        message: "user has already registered with email " + email,
      });
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(plainTextPassword, salt);
  const password = hashPassword;
  const newUser = new User({ name, email, password });
  await newUser.save();
  logger.info("SUCCESSFUL_REGISTRATION", {
    timeStamp: new Date(),
    email: email,
  });
  res.json({ success: true, message: "user registered successfully" });
};

const loginUser = async (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    logger.info("LOGIN_FAILURE", {
      timeStamp: new Date(),
      reason: "user does not exist with ID " + email,
    });
    return res.status(404).json({
      success: false,
      message: "User does not exist, pleaes register first",
    });
  }

  console.log(user);
  const hashPassword = await user.password;
  const isPasswordValid = await bcrypt.compare(plainTextPassword, hashPassword);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    logger.info("LOGIN_FAILURE", {
      timeStamp: new Date(),
      reason: "incorrect password " + email,
    });
    return res
      .status(404)
      .json({ success: false, message: "Incorrect username or password" });
  }

  logger.info("LOGIN_SUCCESSFUL", { timeStamp: new Date(), email: user.email });
  const session_expiry_seconds =
    Math.floor(Date.now() / 1000) + SESSION_TIME_SECONDS;
  const tokenPayload = {
    email: email,
    exp: session_expiry_seconds,
    _id: user._id,
  };

  const token = jwt.sign(tokenPayload, jwtsecretKey);
  await User.findByIdAndUpdate(user._id, { token: token });
  console.log(token);

  res.json({ success: true, token: token });
};

const logoutUser = async (req, res) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token);
  await User.findByIdAndUpdate(decodedToken._id, { token: "" });
  logger.info("LOGOUT_SUCCESSFUL", {
    timeStamp: new Date(),
    reason: `user with email : ${decodedToken.email} logged out`,
  });
  res.json({ success: true, message: "user logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
