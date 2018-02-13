const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 14;
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/profileUser", ensureLoggedIn(), (req, res, next) => {
  res.render("users/userProfile");
});

module.exports = router;
