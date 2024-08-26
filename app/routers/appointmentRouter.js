const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all schedules
appointmentRouter.get(
    "/admin/all",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllAppointments
  );
  
  // Get schedules by staff
  appointmentRouter.get(
    "/patient/all",
    authenticate,
    checkRoles(["patient", "admin"]),
    appointmentController.getAppoinmentsByPatient
  );

module.exports = appointmentRouter;