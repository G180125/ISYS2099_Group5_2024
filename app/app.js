/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");

const { appointmentRoutes, authRoutes, scheduleRoutes, patientRoutes, staffRoutes } = require("./routes");

const app = express();

app.set("trust proxy", true);

// Use helmet to secure HTTP headers
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//http://localhost:2099/hospital_management/api/v1/
const SERVER_PORT = process.env.SERVER_PORT || 2099;
const WHITE_CORS = `http://localhost:${SERVER_PORT}`;
const API_PREFIX = '/hospital_management/api/v1';

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === WHITE_CORS || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes setup with prefix
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/patient`, patientRoutes);
app.use(`${API_PREFIX}/staff`, staffRoutes);
app.use(`${API_PREFIX}/schedule`, scheduleRoutes);
app.use(`${API_PREFIX}/appointment`, appointmentRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route$
app.get("/hospital_management/api/v1", (req, res) => {
  return res
  .status(httpStatus.OK().code)
  .json({ message: "Server is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Set a default error code if it's not provided
  const statusCode = err.code || 500;
  
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});


// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

module.exports = app;
