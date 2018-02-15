const express = require("express");
const router = express.Router();
const Facility = require("../models/facility");

router.get("/facilityList", (req, res, next) => {
  const zipcodeNavBar = req.body.zipcodeNavBar;
  const facilityList = [];
  Facility.find({}, (err, facilities) => {
    for (let i = 0; i < facilities.length; i++) {
      if (zipcode === facilities[i].zipcode) {
        facilityList.push(facilities[i]);
      }
    }
    res.render("facility/facilityList", { facilityResults: facilityList });
    // if (matchingFacility.length === 0) {
    //   console.log("No matching research");
    //   res.render("searches/search", {
    //     facilityResults: [
    //       {
    //         name: "No matching, your request has been saved!",
    //         userPic: "/images/noMatches.jpg"
    //       }
    //     ]
    //   });
    // } else {
    //   res.render("facilityList", { facilityResults: facilityList });
    // }
  });
});

module.exports = router;
