const Country = require("../models/Country");
const Degree = require("../models/Degree");
const Occupation = require("../models/Occupation");
const Religion = require("../models/Religion");
const Caste = require("../models/Caste");
const Employed = require("../models/Employed");
const MotherTongue = require("../models/MotherTongue");

/* ===============================
COUNTRIES
================================ */
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
DEGREES
================================ */
exports.getDegrees = async (req, res) => {
  try {
    const degrees = await Degree.find().sort({ name: 1 });
    res.json(degrees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
OCCUPATIONS
================================ */
exports.getOccupations = async (req, res) => {
  try {
    const occupations = await Occupation.find().sort({ name: 1 });
    res.json(occupations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
RELIGIONS
================================ */
exports.getReligions = async (req, res) => {
  try {
    const religions = await Religion.find().sort({ name: 1 });
    res.json(religions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
CASTES (RELIGION BASED)
================================ */
exports.getCastesByReligion = async (req, res) => {
  try {
    const { religion } = req.params;

    const castes = await Caste.find({ religion }).sort({ name: 1 });

    res.json(castes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
EMPLOYED TYPES
================================ */
exports.getEmployedTypes = async (req, res) => {
  try {
    const employed = await Employed.find().sort({ name: 1 });
    res.json(employed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
MOTHER TONGUES
================================ */
exports.getMotherTongues = async (req, res) => {
  try {
    const tongues = await MotherTongue.find().sort({ name: 1 });
    res.json(tongues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};