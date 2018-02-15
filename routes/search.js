const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Search = require("../models/search");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/search", ensureLoggedIn(), (req, res, next) => {
  res.render("searches/search", { matching: [] });
});

router.post("/search", ensureLoggedIn(), (req, res, next) => {
  const address = req.body.address;
  const zipcode = req.body.zipcode;
  const localisation = req.body.localisation;
  const day = req.body.day;
  const time = req.body.time;
  const search = new Search({
    userId: req.user.id,
    username: req.user.username,
    userPic: req.user.picPath,
    address,
    zipcode,
    localisation,
    day,
    time
  });
  const matchingSearch = [];

  search.save(err => {
    if (err) return next(err);
  });

  Search.find({}, (err, searches) => {
    for (let i = 0; i < searches.length; i++) {
      if (
        zipcode === searches[i].zipcode &&
        day === searches[i].day &&
        time === searches[i].time
      ) {
        if (search.userId.toString() !== searches[i].userId.toString()) {
          console.log(search.userId + "search");
          console.log(searches[i].userId);
          matchingSearch.push(searches[i]);
        }
      }
    }
    if (matchingSearch.length === 0) {
      console.log("No matching research");
      res.render("searches/search", {
        matching: [
          {
            username: "No matching, your request has been saved!",
            userPic: "/images/noMatches.jpg"
          }
        ]
      });
    } else {
      res.render("searches/search", { matching: matchingSearch });
    }
  });
});

module.exports = router;
