const express = require("express");
const departmentRouter = express.Router();
const departmentController = require("../controllers/departmentController");



/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /department/all:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: A list of all departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   department_name:
 *                     type: string
 *                     description: The name of the department
 *                     example: Cardiology
 *       500:
 *         description: Internal server error
 */
// Get all departments
departmentRouter.get(
    "/all",
    departmentController.getAllDepartments
);
/**
 * @swagger
 * /department/doctor:
 *   get:
 *     summary: Get all doctors by department
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: department_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the department
 *         example: Cardiology
 *     responses:
 *       200:
 *         description: A list of doctors in the specified department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     description: The first name of the doctor
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     description: The last name of the doctor
 *                     example: Doe
 *                   department_name:
 *                     type: string
 *                     description: The name of the department
 *                     example: Cardiology
 *       400:
 *         description: Bad request, department name not provided
 *       500:
 *         description: Internal server error
 */

// Get all doctors by department
departmentRouter.get(
    "/doctor",
    departmentController.getAllDoctorsByDepartment
);

module.exports = departmentRouter;
