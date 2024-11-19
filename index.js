require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const core = require("cors");
const dotenv = require("dotenv");
const { json } = require("express");
const connectDB = require("./config/dbConnection");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(core());

app.use("/api/auth", require("./routes/AuthRouter"));

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