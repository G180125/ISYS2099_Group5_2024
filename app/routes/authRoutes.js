const express = require("express");
const authRouter = express.Router();

const { authenticate } = require("../middleware/authenticate");

const {
  register,
  login,
  loginStaff,
  logout,
} = require("../controllers/authController");

authRouter.post("/new", register);
authRouter.post("/login", login);

authRouter.post("/login/staff", loginStaff);

authRouter.delete("/logout", authenticate, logout);

module.exports = authRouter;