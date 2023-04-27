const LocalStrategy = require("passport-local");
const User = require("../../models/user");

module.exports = function (passport) {
  passport.use(
    "signin",
    new LocalStrategy(async function (username, password, done) {
      const user = await User.findOne({ username });
      if (user) {
        const match = await user.verifyPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, "wrong password");
        }
      } else {
        return done(null, false, "user not found");
      }
    })
  );
};
