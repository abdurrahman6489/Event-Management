const express = require("express");
const userController = require("../controller/user.js");
const router = new express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

module.exports = router;
