const express = require("express");
const authRouter = express.Router();
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

const {
  registerPatient,
  registerStaff,
  login,
  loginStaff,
  logout,
} = require("../controllers/authController");


authRouter.post("/staff/new", authenticate, checkRoles(["admin"]), registerStaff);

/**
 * @swagger
 * /auth/staff/login:
 *   post:
 *     summary: Staff(Doctor) login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: eve.brown@hospital.management.com
 *               password:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: Staff logged in successfully
 *       400:
 *         description: Invalid credentials
 */


authRouter.post("/staff/login", loginStaff);
/**
 * @swagger
 * /auth/staff/login:
 *   post:
 *     summary: Staff (Admin) login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: eve.williams@hospital.management.com
 *               password:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: Staff logged in successfully
 *       400:
 *         description: Invalid credentials
 */
authRouter.post("/patient/new", registerPatient);
/**
 * @swagger
 * /auth/patient/login:
 *   post:
 *     summary: Patient login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: paul@gmail.com
 *               password:
 *                 type: string
 *                 example: test
 *     responses:
 *       200:
 *         description: Staff logged in successfully
 *       400:
 *         description: Invalid credentials
 */
authRouter.post("/patient/login", login);

authRouter.delete("/logout", authenticate, logout);

module.exports = authRouter;