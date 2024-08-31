const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// get  patient treatment history for given duration
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email" : "paul@gmail.com"
// }
reportRouter.get(
  "/patient",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewPatientTreatmentForGivenDuration
);

//get doctor work for given duration
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "eve.brown@hospital.management.com"
// }
reportRouter.get(
  "/doctor",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewDoctorWorkForGivenDuration
);

module.exports = reportRouter;
