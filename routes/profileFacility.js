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

router.get("/goodPractices", ensureLoggedIn(), (req, res, next) => {
  res.render("facility/goodPractices");
});

router.get("/editFacility", ensureLoggedIn(), (req, res, next) => {
  const facilityId = req.params._id;

  Facility.findById(facilityId, (err, product) => {
    if (err) {
      return next(err);
    }
    res.render("facility/editFacility");
  });
});

router.post("/editFacility", ensureLoggedIn(), (req, res, next) => {
  const facilityId = req.params._id;

  const updates = {
    name: req.body.name,
    picPath: req.body.picPath,
    picName: req.body.picName,
    address: req.body.address,
    zipcode: req.body.zipcode,
    postalCode: req.body.postalCode,
    phone: req.body.phone,
    description: req.body.description,
    openingDays: req.body.openingDays,
    website: req.body.website,
    facilityType: req.body.facilityType
  };

  Facility.findByIdAndUpdate(facilityId, updates, (err, product) => {
    if (err) {
      console.log("modif marche pas");
      return next(err);
    }
    console.log("Debug facilityId:", facilityId);
    return res.redirect("/profileFacility");
  });
});

module.exports = router;
