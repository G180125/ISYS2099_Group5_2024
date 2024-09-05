const express = require("express");
const ticketRouter = express.Router();
const appointmentController = require("../controllers/ticketController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

//get all the tickets
ticketRouter.get(
    "",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllTickets
);

//get all the tickets of a staff
ticketRouter.get(
    "/my",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.getMyTickets
);

// Create a ticket
//{
//  "newFirstName" : "testing"
// }
ticketRouter.post(
    "/new",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.createTicket
);

// Update a ticket
//{ 
//  "ticketId" : 1,
//  "newFirstName" : "testing"
// }
ticketRouter.put(
    "",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateTicket
);

//approve a ticket
//{ 
//  "ticketId" : 1
// }
ticketRouter.post(
    "/approve",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.approveTicket
);

//reject a ticket
//{ 
//  "ticketId" : 1,
//  "note" : "reject because of  ..."
// }    
ticketRouter.post(
    "/reject",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.rejectTicket
);

//delete a ticket
//{ 
//  "ticketId" : 1,
// } 
ticketRouter.delete(
    "",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.deleteTicket
);
  
module.exports = ticketRouter;