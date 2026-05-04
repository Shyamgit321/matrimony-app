const mongoose = require("mongoose");

const motherTongueSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("MotherTongue", motherTongueSchema);