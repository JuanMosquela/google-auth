const express = require("express");
const path = require("path");
const passport = require("passport");
const dotenv = require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: "clave-secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.ID,
      clientSecret: process.env.SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
  (req, res) => {}
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/failure",
  }),
  (req, res) => {}
);

app.get("/auth/logout", (req, res) => {
  req.session = null;
  res.send("goodbye");
});

app.listen(PORT, (req, res) => {
  console.log("server running");
});
