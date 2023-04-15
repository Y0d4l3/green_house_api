const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  apiToken: { type: String, required: true, unique: true },
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Device", deviceSchema);
