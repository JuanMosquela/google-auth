const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv").config();

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

module.exports = passport;
