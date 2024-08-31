const express = require("express");
const ticketRouter = express.Router();
const appointmentController = require("../controllers/ticketController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Create a ticket
ticketRouter.post(
    "/new",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.createTicket
);
  
module.exports = ticketRouter;