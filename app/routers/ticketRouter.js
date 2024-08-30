const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controllers/ticketController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all schedules
ticketRouter.get(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.createTicket
);
  
module.exports = appointmentRouter;