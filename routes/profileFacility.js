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

// router.get("/editFacility", ensureLoggedIn(), (req, res, next) => {
//   res.render("facility/editFacility");
// });

// router.post("/editFacility", ensureLoggedIn(), (req, res, next) => {
//   const productId = req.params.id;

//   /*
//    * Create a new object with all of the information from the request body.
//    * This correlates directly with the schema of Product
//    */
//   const updates = {
//     name: req.body.name,
//     price: req.body.price,
//     imageUrl: req.body.imageUrl,
//     description: req.body.description
//   };

//   Product.findByIdAndUpdate(productId, updates, (err, product) => {
//     if (err) {
//       return next(err);
//     }
//     return res.redirect("/products");
//   });
// });

module.exports = router;
