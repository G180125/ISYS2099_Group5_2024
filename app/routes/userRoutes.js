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
  "/patient/:email",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  userController.getPatientByEmail
);

// Get staff by email
userRouter.get(
  "/staff/:email",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  userController.getStaffByEmail
);

// Update a patient
userRouter.put(
  "/patient/:email",
  authenticate,
  checkRoles(["patient"]),
  userController.updatePatient
);

// Update staff 
userRouter.put(
  "/staff/:email",
  authenticate,
  checkRoles(["staff", "admin"]),
  userController.updateStaff
);

// Delete a patient
userRouter.delete(
  "/patient/:email",
  authenticate,
  checkRoles(["admin"]),
  userController.deletePatientByEmail
);

// Delete a staff
userRouter.delete(
  "/staff/:email",
  authenticate,
  checkRoles(["admin"]),
  userController.deletePatientByEmail
);


module.exports = userRouter;
