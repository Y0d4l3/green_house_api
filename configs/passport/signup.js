const LocalStrategy = require("passport-local");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    "signup",
    new LocalStrategy(async function (username, password, done) {
      const user = await User.findOne({ username });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        newUser
          .save()
          .then((savedUser) => {
            req.login(savedUser, (error) => {
              if (error) {
                return done(error, false);
              } else {
                return done(null, savedUser);
              }
            });
          })
          .catch((error) => {
            return done(error, false);
          });
      } else {
        return done(null, false, "username already in user");
      }
    })
  );
};
