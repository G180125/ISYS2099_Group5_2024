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
  
  // Get schedules by patient
  appointmentRouter.get(
    "/patient/all",
    authenticate,
    checkRoles(["patient", "admin"]),
    appointmentController.getAppoinmentsByPatient
  );

  appointmentRouter.put(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateAppointment
  );

module.exports = appointmentRouter;