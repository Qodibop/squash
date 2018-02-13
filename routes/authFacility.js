const express = require("express");
const router = express.Router();
const Facility = require("../models/facility");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 14;
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/signupFacility", ensureLoggedOut(), (req, res, next) => {
  res.render("authFacility/signup");
});

router.post("/signupFacility", ensureLoggedOut(), (req, res, next) => {
  const facilityemail = req.body.facilityemail;
  const password = req.body.password;
  const name = req.body.name;
  const address = req.body.address;
  const postalCode = req.body.postalCode;
  const phone = req.body.phone;
  const description = req.body.description;
  const openingDays = req.body.openingDays;
  const website = req.body.website;
  const facilityType = req.body.facilityType;
  // const {
  //   facilityemail,
  //   password,
  //   name,
  //   address,
  //   postalCode,
  //   phone,
  //   description,
  //   openingDays,
  //   website,
  //   facilityType
  // } = req.body;

  if (!password) {
    req.flash("error", "Password is required");
    return res.redirect("/signupFacility");
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return next(err);
      const facility = new Facility({
        facilityemail,
        password: hash,
        name,
        address,
        postalCode,
        phone,
        description,
        openingDays,
        website,
        facilityType
      });
      facility.save(err => {
        if (err) {
          if (err.code === 11000) {
            req.flash("error", `The following email: ${facilityemail} already exists`);
            return res.redirect("/signupFacility");
          } else if (facility.errors) {
            Object.values(facility.errors).forEach(error => {
              req.flash("error", error.message);
            });
            return res.redirect("/signupFacility");
          }
        }
        if (err) return next(err);
        res.redirect("/loginFacility");
      });
    });
  });
});

router.get("/loginFacility", ensureLoggedOut(), (req, res, next) => {
  res.render("authFacility/login");
});

router.post(
  "/loginFacility",
  ensureLoggedOut(),
  passport.authenticate("facility-login", {
    successRedirect: "/profileFacility",
    failureRedirect: "/loginFacility",
    failureFlash: true
  })
);

router.get("/logout", ensureLoggedIn(), (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
