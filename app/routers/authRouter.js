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

authRouter.post("/patient/new", registerPatient);
authRouter.post("/patient/login", login);

authRouter.post("/staff/new", checkRoles(["admin"]), registerStaff);
authRouter.post("/staff/login", loginStaff);

authRouter.delete("/logout", authenticate, logout);

module.exports = authRouter;  