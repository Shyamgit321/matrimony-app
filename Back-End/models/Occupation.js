const mongoose = require("mongoose");

const occupationSchema = new mongoose.Schema({
  category: String,
  occupations: [String]
});

module.exports = mongoose.model("Occupation", occupationSchema);