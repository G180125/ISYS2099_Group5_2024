const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// get patient treatment history for a specific date
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email" : "paul@gmail.com"
// }
reportRouter.get(
  "/range_query/patient",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewPatientTreatmentForGivenDuration
);

// get all patient treatment history within a date range
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
// }
reportRouter.get(
  "/range_query/patient/all",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewAllPatientTreatmentInGivenDuration
);

//get doctor work for given duration
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "eve.brown@hospital.management.com"
// }
reportRouter.get(
  "/range_query/doctor",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewDoctorWorkForGivenDuration
);

//get doctor work for given duration
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
// }
reportRouter.get(
  "/range_query/doctor/all",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewAllDoctorWorkInGivenDuration
);

module.exports = reportRouter;
