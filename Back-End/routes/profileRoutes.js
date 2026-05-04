const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  updateSetupStep1,
  updateProfileDetails,
  updateCareerDetails,
  updateFamilyDetails,
  updateFullProfile
} = require("../controllers/profileController");

const User = require("../models/User");


/* ===============================
   PROFILE STEP ROUTES
================================ */

router.put("/setup-step1", protect, updateSetupStep1);
router.put("/profile-details", protect, updateProfileDetails);
router.put("/career-details", protect, updateCareerDetails);
router.put("/family-details", protect, updateFamilyDetails);
router.put("/update-all", protect, updateFullProfile);


/* ===============================
   SMART MATCHES + BACKEND FILTER
================================ */
router.get("/matches", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const {
      search,
      city,
      religion,
      country,
      profession,
      marital,
      age
    } = req.query;

    let query = {
      _id: { $ne: req.user.id },
      isProfileComplete: true
    };

    /* ===============================
      MATCH PREFERENCE (MAIN FIX)
    ================================= */
    const pref = currentUser.matchPreference || "opposite";

    if (pref === "opposite") {
      query.gender = currentUser.gender === "Male" ? "Female" : "Male";
    }
    else if (pref === "same") {
      query.gender = currentUser.gender;
    }
    else if (pref === "both") {
      // no gender filter
    }

    /* ===============================
       SEARCH
    ================================= */
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { occupation: { $regex: search, $options: "i" } }
      ];
    }

    /* ===============================
       FILTERS
    ================================= */
    if (city) query.city = { $regex: `^${city}$`, $options: "i" };
    if (religion) query.religion = { $regex: `^${religion}$`, $options: "i" };
    if (country) query.country = { $regex: `^${country}$`, $options: "i" };
    if (profession) query.occupation = { $regex: `^${profession}$`, $options: "i" };
    if (marital) query.maritalStatus = marital;

    let users = await User.find(query).select("-password");

    /* ===============================
       AGE FILTER
    ================================= */
    const getAge = (dob) => {
      if (!dob) return null;
      return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    if (age) {
      users = users.filter(u => {
        const userAge = getAge(u.dob);
        return userAge == age;
      });
    }

    /* ===============================
       MATCH SCORE
    ================================= */
    const currentAge = getAge(currentUser.dob);

    users = users.map(user => {
      let score = 0;

      if (user.city && user.city === currentUser.city) score += 2;
      if (user.religion && user.religion === currentUser.religion) score += 3;
      if (user.motherTongue && user.motherTongue === currentUser.motherTongue) score += 2;
      if (user.occupation && user.occupation === currentUser.occupation) score += 2;

      const userAge = getAge(user.dob);
      if (currentAge && userAge) {
        const diff = Math.abs(currentAge - userAge);
        if (diff <= 5) score += 3;
      }

      return {
        ...user._doc,
        matchScore: score
      };
    });

    users.sort((a, b) => b.matchScore - a.matchScore);

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ===============================
   UPLOAD PROFILE IMAGE
================================ */
router.post("/upload-image", protect, upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = "/uploads/" + req.file.filename;

    await User.findByIdAndUpdate(req.user.id, {
      profileImage: imagePath
    });

    res.json({
      message: "Image uploaded successfully",
      image: imagePath
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ===============================
   GET SINGLE USER
================================ */
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;