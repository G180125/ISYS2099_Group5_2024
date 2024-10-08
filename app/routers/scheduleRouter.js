const express = require("express");
const scheduleRouter = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all schedules
// {{base_url}}/schedule/all?limit=5&page=1
scheduleRouter.get(
  "/all",
  authenticate,
  checkRoles(["admin"]),
  scheduleController.getAllSchedules
);

// Get schedules by staff
//   {
//     "staff_id": "1"
// }
scheduleRouter.get(
  "/staff/:id",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  scheduleController.getAllSchedulesByStaff
);

scheduleRouter.get(
  "/doctor",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  scheduleController.getAllSchedulesOfDoctors
);

scheduleRouter.get(
  "/doctor/:id",
  authenticate,
  checkRoles(["patient", "admin", "staff"]),
  scheduleController.getAllSchedulesOfDoctorById
);

module.exports = scheduleRouter;