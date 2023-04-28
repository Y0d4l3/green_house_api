const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Device = require("../../models/device");
require("dotenv").config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

module.exports = function (passport) {
  passport.use(
    "jwt",
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      Device.findById(jwt_payload.deviceId)
        .then((device) => {
          if (device) {
            req.deviceId = jwt_payload.deviceId;
            return done(null, device);
          } else {
            return done(null, false, "device not found");
          }
        })
        .catch((error) => done(error, false));
    })
  );
};
