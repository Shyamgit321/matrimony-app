const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ===============================
REGISTER
================================ */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isProfileComplete: false
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
LOGIN
================================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
GET PROFILE
================================ */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// FORGOT PASSWORD
// ===============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({
      message: "Reset token generated",
      token: resetToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// RESET PASSWORD
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword
    });

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
/* ===============================
CHANGE PASSWORD
================================ */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Google user check
    if (!user.password) {
      return res.status(400).json({
        message: "Google account users cannot change password"
      });
    }

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
DELETE PROFILE
================================ */
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // user delete
    await User.findByIdAndDelete(userId);

    res.json({ message: "Profile deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
UPDATE PRIVACY
================================ */
exports.updatePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.privacy = {
      mobileVisibility: req.body.mobileVisibility,
      photoBlur: req.body.photoBlur,
      photoMatchOnly: req.body.photoMatchOnly,
      lastSeen: req.body.lastSeen,
      interestAccess: req.body.interestAccess
    };

    await user.save();

    res.json({ message: "Privacy updated", privacy: user.privacy });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};