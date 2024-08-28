const express = require("express");
const departmentRouter = express.Router();
const departmentController = require("../controllers/departmentController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Get all departments
departmentRouter.get(
    "/all",
    departmentController.getAllDepartments
);

// Get all doctors by department
departmentRouter.get(
    "/doctor",
    departmentController.getAllDoctorsByDepartment
);

module.exports = departmentRouter;
