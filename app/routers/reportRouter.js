const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// get patient treatment history for a specific date
reportRouter.get(
  "/range_query/patient",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewPatientTreatmentForGivenDuration
);

// get all patient treatment history within a date range
reportRouter.get(
  "/range_query/patient/all",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewAllPatientTreatmentInGivenDuration
);

//get doctor work for given duration
reportRouter.get(
  "/range_query/doctor",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewDoctorWorkForGivenDuration
);

//get doctor work for given duration
reportRouter.get(
  "/range_query/doctor/all",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewAllDoctorWorkInGivenDuration
);

module.exports = reportRouter;
