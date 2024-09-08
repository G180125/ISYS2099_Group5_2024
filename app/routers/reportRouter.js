const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// get  patient treatment history 
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email" : "paul@gmail.com"
// }
reportRouter.get(
  "/patient",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewPatientTreatment
);

//get doctor work 
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email": "eve.brown@hospital.management.com"
// }
reportRouter.get(
  "/staff/work",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewDoctorWork
);

//get staff job change
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email": "eve.brown@hospital.management.com"
// }
reportRouter.get(
  "/staff/job_changes",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewStaffJobChanges
);

//get billing
// {
//   "start_date": "2024-09-02",
//   "end_date": "2024-09-15",
//   "email": "eve.brown@hospital.management.com"
// }
reportRouter.get(
  "/billing/:appointment_id",
  authenticate, 
  checkRoles(["admin", "staff", "patient"]), 
  reportController.viewBilling
);



module.exports = reportRouter;
