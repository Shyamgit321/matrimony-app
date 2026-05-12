const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ===============================
// CLOUDINARY STORAGE
// ===============================
const storage = new CloudinaryStorage({
cloudinary: cloudinary,

params: async (req, file) => ({
folder: "mysoul_profiles",

public_id:
  Date.now() +
  "-" +
  file.originalname.replace(/\s+/g, ""),

resource_type: "image",

}),
});

// ===============================
// FILE FILTER
// ===============================
const fileFilter = (req, file, cb) => {
const allowedTypes = [
"image/jpeg",
"image/png",
"image/jpg",
"image/webp",
];

if (allowedTypes.includes(file.mimetype)) {
cb(null, true);
} else {
cb(new Error("Only JPG, PNG, WEBP images allowed"), false);
}
};

// ===============================
// MULTER CONFIG
// ===============================
const upload = multer({
storage,
fileFilter,

limits: {
fileSize: 2 * 1024 * 1024,
},
});

module.exports = upload;
