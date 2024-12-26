const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/productsRouter");

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, userRole  } = req.body;

    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
      return next(errorHandler(400, "All fields are required"));
    }

    const encryptedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username: username,
      email,
      password: encryptedPassword,
      userRole: userRole,
    });

    const user = await newUser.save();
    res.status(200).json("User registered successfully");
  } catch (err) {
    console.error("Error registering user:", err); // Log the error for debugging
    next(err); // Pass the error to the error handler middleware
  }
};

exports.loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password || !email.trim() || !password.trim()) {
        return next(errorHandler(400, "All fields are required"));
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return next(errorHandler(401, "Invalid credentials"));
      }
  
      const isMatch = bcryptjs.compareSync(password, user.password);
  
      if (!isMatch) {
        return next(errorHandler(401, "Invalid credentials"));
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      const { password: pass, ...rest } = user._doc;
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({
        user: rest,
      });
    } catch (err) {
      console.error("Error logging in user:", err); // Log the error for debugging
      next(err); // Pass the error to the error handler middleware
    }
  };



  exports.addOrRemoveFavorite = async (req, res, next) => {
    try {
      const { userId, productId } = req.body;
      console.log('Request Body:', req.body); // Log the request body for debugging
      console.log('User ID:', userId, 'Product ID:', productId); // Log the extracted values
  
      if (userId == null || productId == null) {
        return res.status(400).json({ message: "User ID and Product ID are required." });
      }
  
      // Fetch the user from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Check if the product is already in favorites
      const favoriteIndex = user.favorites.indexOf(productId);
  
      if (favoriteIndex === -1) {
        // Product not in favorites, add it
        user.favorites.push(productId);
      } else {
        // Product in favorites, remove it
        user.favorites.splice(favoriteIndex, 1);
      }
  
      await user.save();
      res.status(200).json({ message: "Favorites updated successfully.", favorites: user.favorites });
    } catch (err) {
      console.error("Error updating favorites:", err); // Log the error for debugging
      next(err); // Pass the error to the error handler middleware
    }
  };