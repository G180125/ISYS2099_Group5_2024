/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const httpStatus = require("./utils/httpStatus");

const app = express();

app.set("trust proxy", true);

// Use helmet to secure HTTP headers
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/user`, userRouter);

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
  res
  .status(httpStatus.INTERNAL_SERVER_ERROR.code)
  .json(httpStatus.INTERNAL_SERVER_ERROR.data);
});

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

module.exports = app;
