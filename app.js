const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejsLayout = require("express-ejs-layouts");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const Facility = require("./models/facility");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const mongoose = require("mongoose");
var cors = require("cors");

mongoose.connect("mongodb://localhost/squashDB");

const app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(ejsLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "squashProject",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

//Merci Eduardo
passport.serializeUser((facility, cb) => {
  cb(null, { id: facility.id, isUser: facility.username });
});

passport.deserializeUser(({ id, isUser }, cb) => {
  if (isUser) User.findById(id, cb);
  else Facility.findById(id, cb);
});

app.use(flash());

//Passport strategy facility
passport.use(
  "facility-login",
  new LocalStrategy(
    {
      usernameField: "facilityemail",
      passReqToCallback: true
    },
    (req, facilityemail, password, done) => {
      console.log("DEBUG facilityemail", facilityemail);
      Facility.findOne({ facilityemail }, (err, facility) => {
        if (err) return done(err);
        if (!facility) {
          return done(null, false, { message: "Incorrect email" });
        }
        bcrypt.compare(password, facility.password, (err, isTheSame) => {
          if (err) return done(err);
          if (!isTheSame)
            return done(null, false, { message: "Incorrect password" });
          done(null, facility);
        });
      });
    }
  )
);

//Passport strategy user
passport.use(
  "user-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, isTheSame) => {
          if (err) return done(err);
          if (!isTheSame)
            return done(null, false, { message: "Incorrect password" });
          done(null, user);
        });
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

//if bug, it's probably here
app.use((req, res, next) => {
  res.locals.facility = req.user;
  res.locals.user = req.user;
  res.locals.errors = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/", require("./routes/authUser"));
app.use("/", require("./routes/authFacility"));
app.use("/", require("./routes/profileFacility"));
app.use("/", require("./routes/profileUser"));
app.use("/", require("./routes/search"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
