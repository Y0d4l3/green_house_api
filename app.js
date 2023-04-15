const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const morgan = require("morgan");
const userRoutes = require("./routes/user");
const deviceRoutes = require("./routes/device");
const temperatureReadingRoutes = require("./routes/temperatureReading");
const humidityReadingRoutes = require("./routes/humidityReading");

if (process.env.NODE_ENV !== "production") dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
    }),
  })
);

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRoutes);
app.use("/", deviceRoutes);
app.use("/", temperatureReadingRoutes);
app.use("/", humidityReadingRoutes);

main()
  .then(() => {
    app.listen(PORT, console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));
