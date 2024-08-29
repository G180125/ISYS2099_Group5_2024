/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const { errorHandler } = require("./controllers/errorController");
const httpStatus = require("./utils/httpStatus");
const { authRouter, patientRouter, staffRouter, scheduleRouter, appointmentRouter, treatmentRouter, departmentRouter } = require("./routers");
const app = express();

// SECURE HTTP HEADERS
app.set("trust proxy", true);
app.use(helmet());
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

// BODY PARSER
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ENDPOINT 
const SERVER_PORT = process.env.SERVER_PORT || 2099;
const WHITE_CORS = `http://localhost:${SERVER_PORT}`;
const API_PREFIX = '/hospital_management/api/v1';

// basic test
app.get(`${API_PREFIX}`, (req, res) => {
  return res
  .status(httpStatus.OK().code)
  .json({ message: "Server is running" });
});

// Routes setup with prefix
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/patient`, patientRouter);
app.use(`${API_PREFIX}/staff`, staffRouter);
app.use(`${API_PREFIX}/schedule`, scheduleRouter);
app.use(`${API_PREFIX}/appointment`, appointmentRouter);
app.use(`${API_PREFIX}/treatment`, treatmentRouter);
app.use(`${API_PREFIX}/department`, departmentRouter);

// Global error handler
app.use(errorHandler);

// Start the serve
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

module.exports = app;
