const express = require("express");
const scheduleRouter = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all schedules
scheduleRouter.get(
    "/all",
    authenticate,
    checkRoles(["admin"]),
    scheduleController.getAllSchedules
  );
  
  // Get schedules by staff
  scheduleRouter.get(
    "/staff",
    authenticate,
    checkRoles(["patient", "admin", "staff"]),
    scheduleController.getAllSchedulesByStaff
  );

module.exports = scheduleRouter;