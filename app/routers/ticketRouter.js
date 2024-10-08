const express = require("express");
const ticketRouter = express.Router();
const appointmentController = require("../controllers/ticketController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

//get all the tickets of a staff
ticketRouter.get(
    "/my",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.getMyTickets
);

//get all the tickets
ticketRouter.get(
    "/all",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.getAllTickets
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

//approve a ticket
//{ 
//  "ticketId" : 1
// }
ticketRouter.put(
    "/approve/:ticket_id",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.approveTicket
);

//reject a ticket
//{ 
//  "ticketId" : 1,
//  "note" : "reject because of  ..."
// }    
ticketRouter.put(
    "/reject/:ticket_id",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.rejectTicket
);

// Update a ticket
//{ 
//  "ticketId" : 1,
//  "newFirstName" : "testing"
// }
ticketRouter.put(
    "/:ticket_id",
    authenticate,
    checkRoles(["staff"]),
    appointmentController.updateTicket
);

//delete a ticket
//{ 
//  "ticketId" : 1,
// } 
ticketRouter.delete(
    "/:ticket_id",
    authenticate,
    checkRoles(["admin"]),
    appointmentController.deleteTicket
);
  
module.exports = ticketRouter;