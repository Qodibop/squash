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

router.get("/editUserProfile", ensureLoggedIn(), (req, res, next) => {
  const userId = req.params._id;

  User.findById(userId, (err, product) => {
    if (err) {
      return next(err);
    }
    res.render("users/editUserProfile");
  });
});

router.post("/editUserProfile", ensureLoggedIn(), (req, res, next) => {
  const userId = req.params._id;

  const updates = {
    username: req.body.username,
    picPath: req.body.picPath,
    picName: req.body.picName,
    email: req.body.email,
    address: req.body.address,
    zipcode: req.body.zipcode,
    modo: req.body.modo,
    info: req.body.info,
    ranking: req.body.ranking
  };

  User.findByIdAndUpdate(userId, updates, (err, product) => {
    if (err) {
      console.log("modif marche pas");
      return next(err);
    }
    console.log("Debug userId:", userId);
    return res.redirect("/profileUser");
  });
});

module.exports = router;
