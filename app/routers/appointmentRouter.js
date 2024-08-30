const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all appointment
appointmentRouter.get(
    "/all",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllAppointments
  );
  
  // Get my appointments
  appointmentRouter.get(
    "/my",
    authenticate,
    checkRoles(["patient"]),
    appointmentController.getMyAppoinments
  );

  // Get my appointments
  appointmentRouter.get(
    "/patient",
    authenticate,
    checkRoles(["staff", "admin"]),
    appointmentController.getAppointmentsByPatient
  );

  appointmentRouter.post(
    "/new",
    authenticate,
    checkRoles(["patient"]),
    appointmentController.bookAppointment
  );

  appointmentRouter.put(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateAppointment
  );
  
  appointmentRouter.put(
    "/cancel",
    authenticate,
    checkRoles(["patient"]),
    appointmentController.cancelAppointment
  );

module.exports = appointmentRouter;