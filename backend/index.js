require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const moodRoutes = require('./routes/moodRoutes'); // ✅ Keep this
const connectDB = require("./config/db");

// Use the app from app.js
const app = require("./app");

// Connect to DB
connectDB();

// ✅ Plug mood routes

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
