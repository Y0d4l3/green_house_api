const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("../passport");

exports.registerUser = (req, res) => {
  if (req.user) {
    return res.status(401).json("please log out before registering a new user");
  }
  const { username, email, password } = req.body;
  User.findOne({ $or: [{ username: username }, { email: email }] })
    .then(async (existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .json("user with the same username or email already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      newUser
        .save()
        .then((savedUser) => {
          req.login(savedUser, (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("successfully registered");
          });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

exports.loginUser = (req, res, next) => {
  if (req.user) {
    return res.status(401).json("you are already logged in");
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("successfully logged in");
    });
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json("you are not logged in");
  }
  req.logout(function (err) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json("successfully logged out");
  });
};
