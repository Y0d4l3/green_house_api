const signin = require("./signin");
const signup = require("./signup");
const jwt = require("./jwt");
const User = require("../../models/user");

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false, { message: "user not found" });
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

  signin(passport);
  signup(passport);
  jwt(passport);
};
