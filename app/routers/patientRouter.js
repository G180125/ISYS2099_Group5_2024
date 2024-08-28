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

// Get patient by email
patientRouter.get(
  "",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  patientController.getPatientByEmail
);

// Get patient by name
patientRouter.get(
  "/search",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  patientController.getPatientByname
);

// Update a patient
patientRouter.put(
  "/patient",
  authenticate,
  checkRoles(["patient"]),
  patientController.updatePatient
);

// Delete a patient
patientRouter.delete(
  "/patient",
  authenticate,
  checkRoles(["admin"]),
  patientController.deletePatientByEmail
);

// 

module.exports = patientRouter;
