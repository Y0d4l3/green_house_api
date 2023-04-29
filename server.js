const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

if (process.env.NODE_ENV !== "production") dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

app.use(cors({ 
  origin: true, 
  credentials: true 
}));

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
    cookie: {
      secure: auto,
    },
  })
);

const initPassport = require("./configs/passport/init");
initPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/user");
const deviceRoutes = require("./routes/device");
const sensorDataRoutes = require("./routes/sensorData");

app.use("/", userRoutes);
app.use("/", deviceRoutes);
app.use("/", sensorDataRoutes);

main()
  .then(() => {
    app.listen(PORT, console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));
