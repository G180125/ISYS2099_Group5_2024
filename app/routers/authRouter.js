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
authRouter.post("/staff/new", checkRoles(["admin"]), registerStaff);

authRouter.post("/login/patient", login);
authRouter.post("/login/staff", loginStaff);
authRouter.delete("/logout", authenticate, logout);

module.exports = authRouter;   

// <<<<<<< HEAD

// const {
//   registerPatient,
//   registerStaff,
//   login,
//   loginStaff,
//   logout,
// } = require("../controllers/authController");

// authRouter.post("/patient/new", registerPatient);
// authRouter.post("/patient/login", login);

// authRouter.post("/staff/new", checkRoles(["admin"]), registerStaff);
// authRouter.post("/staff/login", loginStaff);

// authRouter.delete("/logout", authenticate, logout);

// module.exports = authRouter;  
// =======
// const express = require("express");
// const authRouter = express.Router();
// const { authenticate } = require("../middleware/authenticate");
// const checkRoles = require("../middleware/checkRoles");

// const {
//   registerPatient,
//   registerStaff,
//   login,
//   loginStaff,
//   logout,
// } = require("../controllers/authController");

// authRouter.post("/patient/new", registerPatient);
// authRouter.post("/staff/new", checkRoles(["admin"]), registerStaff);

// authRouter.post("/login/patient", login);
// authRouter.post("/login/staff", loginStaff);
// authRouter.delete("/logout", authenticate, logout);

// module.exports = authRouter;   
// >>>>>>> main
