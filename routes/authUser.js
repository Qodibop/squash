const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/uploads/user-pictures" });
const User = require("../models/user");
const Search = require("../models/search");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 14;
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/signup", ensureLoggedOut(), (req, res, next) => {
  res.render("authUser/signup");
});

router.post("/signup", ensureLoggedOut(), upload.single("user-picture"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const address = req.body.address;
  const email = req.body.email;

  if (!password) {
    req.flash("error", "Password is required");
    return res.redirect("/signup");
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return next(err);
      const user = new User({
        username,
        password: hash,
        email,
        picPath: `/uploads/user-pictures/${req.file.filename}`,
        picName: req.file.originalname,
        address
      });

      user.save(err => {
        if (err) {
          if (err.code === 11000) {
            req.flash("error", `A user with username ${username} already exists`);
            return res.redirect("/signup");
          } else if (user.errors) {
            Object.values(user.errors).forEach(error => {
              req.flash("error", error.message);
            });
            return res.redirect("/signup");
          }
        }
        if (err) return next(err);
        res.redirect("/login");
      });
    });
  });
});

router.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("authUser/login");
});

router.post(
  "/login",
  ensureLoggedOut(),
  passport.authenticate("local-login", {
    successRedirect: "/profileUser",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", ensureLoggedIn(), (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
