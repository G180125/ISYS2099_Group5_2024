const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all appointment
// {{base_url}}/appointment/all?page=1&limit=10&offset=1
appointmentRouter.get(
  "/all",
  authenticate,
  checkRoles(["admin"]),
  appointmentController.getAllAppointments
);

// Get my appointments
// {{base_url}}/appointment/my?status=U&page=1&limit=1
appointmentRouter.get(
  "/my",
  authenticate,
  checkRoles(["patient"]),
  appointmentController.getMyAppoinments
);

// Get my appointments
// {{base_url}}/appointment/patient?status=U&page=1&limit=1
// {
//   "id": "2"
// }
appointmentRouter.get(
  "/patient/:id",
  authenticate,
  checkRoles(["staff", "admin"]),
  appointmentController.getAppointmentsByPatient
);

// {{base_url}}/appointment/new
// {
//   "patientID":"3",
//   "doctorID":"4",
//   "date":"2024-09-13",
//   "slotNumber":"2",
//   "purpose":"Check my teeth"
// }
appointmentRouter.post(
  "/new",
  authenticate,
  checkRoles(["patient"]),
  appointmentController.bookAppointment
);

// {{base_url}}/appointment/cancel
// {
//   "patient_id":"3",
//   "appointment_id":"3"
// }
appointmentRouter.put(
  "/cancel",
  authenticate,
  checkRoles(["patient"]),
  appointmentController.cancelAppointment
);

// {{base_url}}/appointment/finish
// {
//   "appointment_id":"4"
// }
appointmentRouter.put(
  "/finish",
  authenticate,
  checkRoles(["staff"]),
  appointmentController.finishAppointment
);

// {{base_url}}/appointment/
// {
//   "appointmentId":"3",
//   "date":"2024-09-12",
//   "timeSlot":"2"
// }
appointmentRouter.put(
  "",
  authenticate,
  checkRoles(["staff", "patient"]),
  appointmentController.updateAppointment
);

module.exports = appointmentRouter;
