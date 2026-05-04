const express = require("express");
const router = express.Router();

const {
   register,
   login,
   forgotPassword,
   resetPassword,
   getProfile,
   changePassword,
   deleteProfile,
   updatePrivacy
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// 🔥 GOOGLE AUTH IMPORT
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ===============================
PUBLIC ROUTES
================================ */
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", protect, changePassword);
router.delete("/delete-profile", protect, deleteProfile);
router.put("/privacy", protect, updatePrivacy);

/* ===============================
GOOGLE LOGIN
================================ */
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    // VERIFY GOOGLE TOKEN
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        profileImage: picture
      });
    } else {
      if (!user.googleId) {
        user.googleId = sub;
      }

      if (!user.profileImage) {
        user.profileImage = picture;
      }

      await user.save();
    }

    const tokenJWT = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login success",
      token: tokenJWT,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Google login failed" });
  }
});


/* ===============================
PROTECTED ROUTES
================================ */
router.get("/profile", protect, getProfile);

module.exports = router;