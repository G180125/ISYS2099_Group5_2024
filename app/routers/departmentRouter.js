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
    "/doctor/:id",
    departmentController.getAllDoctorsByDepartment
);

departmentRouter.put(
    "/update",
    authenticate,
    checkRoles(["admin"]),
    departmentController.updateDepartment
);


module.exports = departmentRouter;
