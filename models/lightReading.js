const mongoose = require("mongoose");

const lightReadingSchema = new mongoose.Schema({
  visible_plus_ir_value: { type: Number, required: true },
  infrared_value: { type: Number, required: true },
  unit: { type: String, enum: ["Lux"], default: "Lux" },
});

module.exports = mongoose.model("LightReading", lightReadingSchema);
