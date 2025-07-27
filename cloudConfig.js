const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Configure storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LuxoraBnB", // Folder name in Cloudinary
    allowed_formats: ["jpeg", "png", "jpg", "webp"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
