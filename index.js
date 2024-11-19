require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { json } = require("express");
const connectDB = require("./config/dbConnection");
const cookieParser = require('cookie-parser');
const path = require("path");
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your client URL
  credentials: true, // Allow credentials
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/AuthRouter"));
app.use("/api/products", require("./routes/productsRouter"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});