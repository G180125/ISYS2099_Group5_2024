const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all patients
userRouter.get(
  "/patient/all",
  authenticate,
  checkRoles(["admin"]),
  userController.getAllPatients
);

// Get all staff
userRouter.get(
  "/staff/all",
  authenticate,
  checkRoles(["patient", "admin"]),
  userController.getAllStaffs
);

// Get patient by email
userRouter.get(
  "/patient",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  userController.getPatientByEmail
);

// Get patient by name
userRouter.get(
  "/patient/search",
  authenticate,
  checkRoles(["patient", "admin"]),
  userController.getPatientByname
);

// Get staff by email
userRouter.get(
  "/patient",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  userController.getStaffByEmail
);

// Update a patient
userRouter.put(
  "/patient",
  authenticate,
  checkRoles(["patient"]),
  userController.updatePatient
);

// Update staff 
userRouter.put(
  "/staff",
  authenticate,
  checkRoles(["staff", "admin"]),
  userController.updateStaff
);

// Delete a patient
userRouter.delete(
  "/patient",
  authenticate,
  checkRoles(["admin"]),
  userController.deletePatientByEmail
);

// Delete a staff
userRouter.delete(
  "/staff",
  authenticate,
  checkRoles(["admin"]),
  userController.deletePatientByEmail
);


module.exports = userRouter;
