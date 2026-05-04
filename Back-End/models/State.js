const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  category: String,
  state: [String]
});

module.exports = mongoose.model("State", stateSchema);