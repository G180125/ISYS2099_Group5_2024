const express = require("express");
const authRouter = express.Router();
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

const {
  registerPatient,
  registerStaff,
  login,
  loginStaff,
  logout,
} = require("../controllers/authController");

// {
//   "email": "johono@gmail.com",
//   "password": "test",
//   "role": "staff"
// }
authRouter.post("/staff/new", authenticate, checkRoles(["admin"]), registerStaff);

// {
//   "email": "johono@gmail.com",
//   "password": "test",
//   "role": "staff"
// }
authRouter.post("/staff/login", loginStaff);

// {
//   "email": "nickkyjimmy@gmail.com",
//   "password": "test"
// }
authRouter.post("/patient/new", registerPatient);

// {
//   "email": "paul@gmail.com",
//   "password": "test"
// }
authRouter.post("/patient/login", login);


authRouter.delete("/logout", authenticate, logout);

module.exports = authRouter;