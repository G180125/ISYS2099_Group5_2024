const express = require("express");
const staffRouter = express.Router();
const staffController = require("../controllers/staffController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all staff
staffRouter.get(
    "/all",
    authenticate,
    checkRoles(["staff", "admin"]),
    staffController.getAllStaffs
);

staffRouter.get(
  "/doctor",
  staffController.getAllDoctors
);

//get my info
staffRouter.get(
  "/my",
  authenticate,
  checkRoles(["staff", "admin"]),
  staffController.getMyInfo
);

// Get staff by id
staffRouter.get(
    "/:id",
    authenticate,
    checkRoles(["patient", "admin", "staff"]),
    staffController.getStaffById
);

// Update my info
staffRouter.put(
    "/",
    authenticate,
    checkRoles(["staff", "admin"]),
    staffController.updateMyInfo
  );

// Delete a staff
// staffRouter.delete(
//     "",
//     authenticate,
//     checkRoles(["admin"]),
//     staffController.deleteStaffById
//   );

module.exports = staffRouter;
