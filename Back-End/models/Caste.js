const mongoose = require("mongoose");

const casteSchema = new mongoose.Schema({
  religion: { type: String, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model("Caste", casteSchema);