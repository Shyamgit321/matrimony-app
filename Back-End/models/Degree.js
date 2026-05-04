const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema({
  category: String,
  degrees: [String]
});

module.exports = mongoose.model("Degree", degreeSchema);