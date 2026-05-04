require("dotenv").config();
const mongoose = require("mongoose");

const Religion = require("./models/Religion");
const Caste = require("./models/Caste");
const MotherTongue = require("./models/MotherTongue");
const Degree = require("./models/Degree");
const Employed = require("./models/Employed");
const Occupation = require("./models/Occupation");
const Country = require("./models/Country");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  console.log("Clearing old data...");

  await Religion.deleteMany();
  await Caste.deleteMany();
  await MotherTongue.deleteMany();
  await Degree.deleteMany();
  await Employed.deleteMany();
  await Occupation.deleteMany();
  await Country.deleteMany();

  console.log("Inserting Religions...");

  await Religion.insertMany([
    { name: "Hindu" },
    { name: "Muslim" },
    { name: "Christian" },
    { name: "Sikh" },
    { name: "Jain" },
    { name: "Buddhist" },
    { name: "Parsi" },
    { name: "Jewish" },
    { name: "Bahai" },
    { name: "Atheist" },
    { name: "Agnostic" },
    { name: "Spiritual" }
  ]);

  console.log("Inserting Castes...");

  await Caste.insertMany([

    // HINDU
    { religion: "Hindu", name: "Brahmin" },
    { religion: "Hindu", name: "Rajput" },
    { religion: "Hindu", name: "Yadav" },
    { religion: "Hindu", name: "Jat" },
    { religion: "Hindu", name: "Maratha" },
    { religion: "Hindu", name: "Nair" },
    { religion: "Hindu", name: "Kayastha" },
    { religion: "Hindu", name: "Agarwal" },
    { religion: "Hindu", name: "Bania" },
    { religion: "Hindu", name: "Kshatriya" },
    { religion: "Hindu", name: "SC" },
    { religion: "Hindu", name: "ST" },
    { religion: "Hindu", name: "OBC" },

    // MUSLIM
    { religion: "Muslim", name: "Sunni" },
    { religion: "Muslim", name: "Shia" },
    { religion: "Muslim", name: "Syed" },
    { religion: "Muslim", name: "Sheikh" },
    { religion: "Muslim", name: "Pathan" },
    { religion: "Muslim", name: "Ansari" },

    // CHRISTIAN
    { religion: "Christian", name: "Roman Catholic" },
    { religion: "Christian", name: "Protestant" },
    { religion: "Christian", name: "Orthodox" },
    { religion: "Christian", name: "Pentecostal" },

    // SIKH
    { religion: "Sikh", name: "Jat Sikh" },
    { religion: "Sikh", name: "Khatri" },
    { religion: "Sikh", name: "Ramgarhia" },

    // JAIN
    { religion: "Jain", name: "Digambar" },
    { religion: "Jain", name: "Shwetambar" },

    // BUDDHIST
    { religion: "Buddhist", name: "Theravada" },
    { religion: "Buddhist", name: "Mahayana" },

    // PARSI
    { religion: "Parsi", name: "Zoroastrian" }

  ]);

  console.log("Inserting Mother Tongues...");

  await MotherTongue.insertMany([
    { name: "Hindi" },
    { name: "Bengali" },
    { name: "Tamil" },
    { name: "Telugu" },
    { name: "Marathi" },
    { name: "Gujarati" },
    { name: "Punjabi" },
    { name: "Malayalam" },
    { name: "Kannada" },
    { name: "Odia" },
    { name: "Assamese" },
    { name: "Urdu" },
    { name: "English" },
    { name: "Sindhi" },
    { name: "Nepali" },
    { name: "Konkani" },
    { name: "Maithili" },
    { name: "Sanskrit" },
    { name: "Spanish" },
    { name: "French" },
    { name: "German" },
    { name: "Arabic" },
    { name: "Japanese" },
    { name: "Korean" },
    { name: "Chinese" }
  ]);

  console.log("Inserting Degrees...");

  await Degree.insertMany([
    { name: "B.E / B.Tech" },
    { name: "M.E / M.Tech" },
    { name: "MBBS" },
    { name: "BDS" },
    { name: "MBA" },
    { name: "BBA" },
    { name: "B.Com" },
    { name: "M.Com" },
    { name: "BA" },
    { name: "MA" },
    { name: "PhD" },
    { name: "Diploma" },
    { name: "12th Pass" }
  ]);

  console.log("Inserting Employed Types...");

  await Employed.insertMany([
    { name: "Private Sector" },
    { name: "Government Job" },
    { name: "Business" },
    { name: "Self Employed" },
    { name: "Defence" },
    { name: "Not Working" }
  ]);

  console.log("Inserting Occupations...");

  await Occupation.insertMany([
    { name: "Software Engineer" },
    { name: "Doctor" },
    { name: "Teacher" },
    { name: "Business Owner" },
    { name: "Chartered Accountant" },
    { name: "Banker" },
    { name: "Civil Engineer" },
    { name: "Mechanical Engineer" },
    { name: "Government Officer" },
    { name: "Marketing Professional" },
    { name: "Designer" },
    { name: "Freelancer" }
  ]);

  console.log("Inserting Countries...");

  await Country.insertMany([
    { name: "India" },
    { name: "USA" },
    { name: "Canada" },
    { name: "UK" },
    { name: "Australia" },
    { name: "UAE" },
    { name: "Germany" },
    { name: "France" },
    { name: "Japan" },
    { name: "Singapore" }
  ]);

  console.log(" ALL MASTER DATA INSERTED SUCCESSFULLY ");
  process.exit();

})
.catch(err => console.log(err));