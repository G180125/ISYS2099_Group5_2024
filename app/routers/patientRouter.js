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
patientRouter.get(
  "/search",
  authenticate,
  checkRoles(["admin", "staff"]),
  patientController.getPatientByname
);

// Update a patient
patientRouter.put(
  "",
  authenticate,
  checkRoles(["patient"]),
  patientController.updatePatient
);

// Delete a patient
patientRouter.delete(
  "",
  authenticate,
  checkRoles(["admin"]),
  patientController.deletePatientByEmail
);

// 

module.exports = patientRouter;
