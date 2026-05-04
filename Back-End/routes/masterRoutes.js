const express = require("express");
const router = express.Router();

const Country = require("../models/Country");
const Degree = require("../models/Degree");
const Occupation = require("../models/Occupation");
const Religion = require("../models/Religion");
const Caste = require("../models/Caste");
const Employed = require("../models/Employed");
const MotherTongue = require("../models/MotherTongue");

// Countries
router.get("/countries", async (req, res) => {
  const data = await Country.find();
  res.json(data);
});

// Degrees
router.get("/degrees", async (req, res) => {
  const data = await Degree.find();
  res.json(data);
});

// Occupations
router.get("/occupations", async (req, res) => {
  const data = await Occupation.find();
  res.json(data);
});

// Religions
router.get("/religions", async (req, res) => {
  const data = await Religion.find();
  res.json(data);
});

// Castes
router.get("/castes/:religion", async (req, res) => {
  const data = await Caste.find({ religion: req.params.religion });
  res.json(data);
});

// Employed
router.get("/employed", async (req, res) => {
  const data = await Employed.find();
  res.json(data);
});

// Mother Tongue
router.get("/mother-tongues", async (req, res) => {
  const data = await MotherTongue.find();
  res.json(data);
});

module.exports = router;