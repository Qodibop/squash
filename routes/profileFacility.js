const express = require("express");
const router = express.Router();
const Facility = require("../models/facility");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 14;
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/profileFacility", ensureLoggedIn(), (req, res, next) => {
  res.render("facility/profile");
});

module.exports = router;
