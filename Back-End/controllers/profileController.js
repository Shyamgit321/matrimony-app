const User = require("../models/User");

/* ===============================
STEP 1 — PROFILE SETUP
================================ */
exports.updateSetupStep1 = async (req, res) => {
  try {
    const { phone, profileFor, gender } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone, profileFor, gender },
      { returnDocument: "after" }
    );

    res.json({ message: "Step 1 Saved", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
STEP 2 — PROFILE DETAILS
================================ */
exports.updateProfileDetails = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      religion,
      caste,
      manglik,
      motherTongue,
      maritalStatus,
      height
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: fullName,
        dob,
        religion,
        caste,
        manglik,
        motherTongue,
        maritalStatus,
        height
      },
      { returnDocument: "after" }
    );

    res.json({ message: "Profile Details Saved", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
STEP 3 — CAREER DETAILS
================================ */
exports.updateCareerDetails = async (req, res) => {
  try {
    const {
      country,
      state,
      city,
      highestDegree,
      employedIn,
      occupation,
      annualIncome,
      about
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        country,
        state,
        city,
        highestDegree,
        employedIn,
        occupation,
        annualIncome,
        about
      },
      { returnDocument: "after" }
    );

    res.json({ message: "Career Details Saved", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
STEP 4 — FAMILY DETAILS
================================ */
exports.updateFamilyDetails = async (req, res) => {
  try {
    const {
      familyType,
      fatherOccupation,
      motherOccupation,
      brotherCount,
      sisterCount,
      familyCountry,
      familyState,
      familyCity,
      familyAbout
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        familyType,
        fatherOccupation,
        motherOccupation,
        brotherCount,
        sisterCount,
        familyCountry,
        familyState,
        familyCity,
        familyAbout,
        isProfileComplete: true
      },
      { returnDocument: "after" }
    );

    res.json({ message: "Family Saved & Profile Completed", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
FULL PROFILE UPDATE (EDIT PAGE)
================================ */
exports.updateFullProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// ===============================
// PHOTO DELETE
// ===============================
if (req.body.deletePhoto === "true") {
  user.profileImage = "";
}

// ===============================
// NEW CLOUDINARY IMAGE
// ===============================
if (req.file) {
  user.profileImage = req.file.path;
}

// ===============================
// BASIC
// ===============================
if (req.body.fullName) user.name = req.body.fullName;
if (req.body.gender) user.gender = req.body.gender;
if (req.body.dob) user.dob = req.body.dob;

// MATCH PREF
if (req.body.matchPreference) {
  user.matchPreference = req.body.matchPreference;
}

// ===============================
// PERSONAL
// ===============================
if (req.body.religion) user.religion = req.body.religion;
if (req.body.caste) user.caste = req.body.caste;
if (req.body.motherTongue) user.motherTongue = req.body.motherTongue;
if (req.body.maritalStatus) user.maritalStatus = req.body.maritalStatus;
if (req.body.height) user.height = req.body.height;

// ===============================
// CAREER
// ===============================
if (req.body.city) user.city = req.body.city;
if (req.body.occupation) user.occupation = req.body.occupation;
if (req.body.annualIncome) user.annualIncome = req.body.annualIncome;
if (req.body.about) user.about = req.body.about;
if (req.body.highestDegree) user.highestDegree = req.body.highestDegree;

// ===============================
// FAMILY
// ===============================
if (req.body.familyType) user.familyType = req.body.familyType;
if (req.body.fatherOccupation) {
  user.fatherOccupation = req.body.fatherOccupation;
}

if (req.body.motherOccupation) {
  user.motherOccupation = req.body.motherOccupation;
}

if (req.body.brotherCount) {
  user.brotherCount = req.body.brotherCount;
}

if (req.body.sisterCount) {
  user.sisterCount = req.body.sisterCount;
}

await user.save();

res.json({
  message: "Profile updated successfully",
  user,
});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
