const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  category: String,
  city: [String]
});

module.exports = mongoose.model("City", citySchema);