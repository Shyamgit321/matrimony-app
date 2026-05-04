const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC INFO
    // ===============================
    name: { type: String, trim: true },

    email: { type: String, unique: true, required: true },

    password: { type: String },

    googleId: { type: String },

    phone: { type: String },
    profileFor: { type: String },
    gender: { type: String },
    isProfileComplete: { type: Boolean, default: false },

    // ===============================
    // MATCH PREFERENCE
    // ===============================
    matchPreference: {
      type: String,
      enum: ["opposite", "same", "both"],
      default: "opposite"
    },

    // ===============================
    // PROFILE DETAILS
    // ===============================
    dob: { type: Date },
    religion: { type: String },
    caste: { type: String },
    manglik: { type: String },
    motherTongue: { type: String },
    maritalStatus: { type: String },
    height: { type: String },

    // ===============================
    // CAREER DETAILS
    // ===============================
    country: { type: String },
    state: { type: String },
    city: { type: String },
    highestDegree: { type: String },
    employedIn: { type: String },
    occupation: { type: String },
    annualIncome: { type: String },
    about: { type: String },

    // ===============================
    // FAMILY DETAILS
    // ===============================
    familyType: { type: String },
    fatherOccupation: { type: String },
    motherOccupation: { type: String },
    brotherCount: { type: String },
    sisterCount: { type: String },
    familyCountry: { type: String },
    familyState: { type: String },
    familyCity: { type: String },
    familyAbout: { type: String },

    // ===============================
    // PROFILE IMAGE
    // ===============================
    profileImage: { type: String, default: "" },

    // PRIVACY SETTINGS
    privacy: {
      mobileVisibility: { type: String, default: "all" },
      photoBlur: { type: Boolean, default: false },
      photoMatchOnly: { type: Boolean, default: false },
      lastSeen: { type: String, default: "online" },
      interestAccess: { type: String, default: "everyone" }
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);