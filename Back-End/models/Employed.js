const mongoose = require("mongoose");

const employedSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("Employed", employedSchema);