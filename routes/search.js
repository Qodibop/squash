const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Search = require("../models/search");
const Facility = require("../models/facility");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/search", ensureLoggedIn(), (req, res, next) => {
  res.render("searches/search", {
    messages: [],
    facilityResults: [],
    searchResults: []
  });
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
  const matchingFacility = [];

  search.save(err => {
    if (err) return next(err);
  });

  Promise.all([Search.find(), Facility.find()])
    .then(values => {
      let searches = values[0];
      let facilities = values[1];
      for (let i = 0; i < searches.length; i++) {
        if (zipcode === searches[i].zipcode && day === searches[i].day && time === searches[i].time) {
          if (search.userId.toString() !== searches[i].userId.toString()) {
            console.log(search.userId + "search");
            console.log(searches[i].userId);
            matchingSearch.push(searches[i]);
          }
        }
      }
      for (let i = 0; i < facilities.length; i++) {
        if (zipcode === facilities[i].zipcode) {
          matchingFacility.push(facilities[i]);
        }
      }
      res.render("searches/search", {
        messages: ["Sorry dude, no facility in this area!", "No matching but your request has been saved!"],
        facilityResults: matchingFacility,
        searchResults: matchingSearch
      });
    })
    .catch(err => console.log(err));

  // Search.find({}, (err, searches) => {
  //   for (let i = 0; i < searches.length; i++) {
  //     if (zipcode === searches[i].zipcode && day === searches[i].day && time === searches[i].time) {
  //       if (search.userId.toString() !== searches[i].userId.toString()) {
  //         console.log(search.userId + "search");
  //         console.log(searches[i].userId);
  //         matchingSearch.push(searches[i]);
  //       }
  //     }
  //   }
  //   if (matchingSearch.length === 0) {
  //     console.log("No matching research");
  //     res.render("searches/search", {
  //       matching: [
  //         {
  //           username: "No matching, your request has been saved!",
  //           userPic: "/images/noMatches.jpg"
  //         }
  //       ]
  //     });
  //   } else {
  //     res.render("searches/search", { matching: matchingSearch });
  //   }
  // });

  // Facility.find({}, (err, facilities) => {
  //   for (let i = 0; i < facilities.length; i++) {
  //     if (zipcode === facilities[i].zipcode) {
  //       matchingFacility.push(facilities[i]);
  //     }
  //   }
  //   if (matchingFacility.length === 0) {
  //     console.log("No matching research");
  //     res.render("searches/search", {
  //       facilityResults: [
  //         {
  //           name: "No matching, your request has been saved!",
  //           userPic: "/images/noMatches.jpg"
  //         }
  //       ]
  //     });
  //   } else {
  //     res.render("searches/search", { facilityResults: matchingFacility });
  //   }
  // });
});

module.exports = router;
