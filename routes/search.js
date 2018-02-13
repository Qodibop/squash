const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Search = require("../models/search");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/search", ensureLoggedIn(), (req, res, next) => {
  res.render("search");
});

router.post("/search", ensureLoggedIn(), (req, res, next) => {
  const localisation = req.body.localisation;
  const day = req.body.day;
  const time = req.body.time;
  const search = new Search({
    localisation,
    day,
    time,
    userId: req.user._id
  });
  search.save(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
