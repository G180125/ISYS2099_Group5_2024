const express = require("express");
const ticketRouter = express.Router();
const appointmentController = require("../controllers/ticketController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

ticketRouter.get(
    "",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllTickets
);

ticketRouter.get(
    "/my",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.getAllTicketsByStaff
);

// Create a ticket
ticketRouter.post(
    "/new",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.createTicket
);

ticketRouter.put(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateTicket
);

ticketRouter.post(
    "/approve",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.approveTicket
);

ticketRouter.post(
    "/reject",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.rejectTicket
);

ticketRouter.delete(
    "",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.deleteTicket
);
  
module.exports = ticketRouter;