const express = require("express");
const patientRouter = express.Router();
const patientController = require("../controllers/patientController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all patients
patientRouter.get(
  "/all",
  authenticate, //email //role -> next req
  checkRoles(["admin"]),
  patientController.getAllPatients
);

// Get myinfo
patientRouter.get(
  "/myInfo",
  authenticate,
  checkRoles(["patient"]),
  patientController.getMyInfo
);

// Get patient by id
patientRouter.get(
  "/id",
  authenticate,
  checkRoles(["staff", "admin"]),
  patientController.getPatientByID
);

// Get patient by name
// {prefix}/patient/search?first_name=Paul&last_name=Buck
patientRouter.get(
  "/search",
  authenticate,
  checkRoles(["admin", "staff"]),
  patientController.getPatientByname
);

// Update my info
// {
//   "newFirstName":"Nhan",
//   "newLastName":"Truong",
//   "newGender":"M",
//   "newDOB":"2003-04-27"
// }
patientRouter.put(
  "",
  authenticate,
  checkRoles(["patient"]),
  patientController.updateMyInfo
);

// Delete patient by id
patientRouter.delete(
  "",
  authenticate,
  checkRoles(["admin"]),
  patientController.deletePatientById
);

module.exports = patientRouter;
