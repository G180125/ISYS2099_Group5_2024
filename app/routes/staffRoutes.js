const express = require("express");
const staffRouter = express.Router();
const staffController = require("../controllers/staffController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all staff
staffRouter.get(
    "/all",
    authenticate,
    checkRoles(["patient", "admin"]),
    staffController.getAllStaffs
);

// Get staff by email
staffRouter.get(
    "",
    authenticate,
    checkRoles(["patient", "admin", "staff"]),
    staffController.getStaffByEmail
);

// Update staff 
staffRouter.put(
    "",
    authenticate,
    checkRoles(["staff", "admin"]),
    staffController.updateStaff
  );

// Delete a staff
staffRouter.delete(
    "",
    authenticate,
    checkRoles(["admin"]),
    staffController.deleteStaffByEmail
  );

module.exports = staffRouter;
