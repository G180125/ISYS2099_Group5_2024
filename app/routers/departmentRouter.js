const express = require("express");
const departmentRouter = express.Router();
const departmentController = require("../controllers/departmentController");

// Get all departments
departmentRouter.get(
    "/all",
    departmentController.getAllDepartments
);

// Get all doctors by department
departmentRouter.get(
    "/doctor/:id",
    departmentController.getAllDoctorsByDepartment
);

module.exports = departmentRouter;
