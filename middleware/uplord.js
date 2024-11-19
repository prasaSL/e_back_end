const multer = require("multer");
const jwt = require("jsonwebtoken");

// Multer configuration for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_FOLDER); // Define your upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).array("images", 10); // Allow up to 10 images

// Middleware to verify JWT and handle image upload
const uploadImagesWithAuth = (req, res, next) => {
    const token = req.cookies['token']; // Get token from cookie

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  // Verify JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach user information to request
    req.user = user;

    // Handle image upload
    upload(req, res, (uploadErr) => {
      if (uploadErr) {
        return res.status(400).json({ message: "Image upload failed", error: uploadErr.message });
      }

      next(); // Proceed to the next middleware or route handler
    });
  });
};

module.exports = uploadImagesWithAuth;
