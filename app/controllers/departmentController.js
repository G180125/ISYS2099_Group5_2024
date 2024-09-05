
const cookieParser = require("cookie-parser");
const express = require("express");
const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const departmentController = {
    getAllDepartments: async (req, res, next) => {
        try {
            const pool = mysqlClient.getPool("patient");

            const [results] = await pool.query(`
            SELECT department_name
            FROM department`);

            res
            .status(httpStatus.OK().code)
            .json(results[0]);
        } catch (error) {
            return next(error);
        }
    },

    getAllDoctorsByDepartment: async (req, res, next) => {
        try {
            const { department_id } = req.params.id;

            const pool = mysqlClient.getPool("patient");

            // Execute query to fetch doctors by department name
            const [results] = await pool.query(
            `
            SELECT S.first_name, S.last_name, D.department_name
            FROM staff_secure_report S
            JOIN department D ON S.department_id = D.department_id
            WHERE S.job_type = 'D' AND D.department_id = ?
            `,
            [department_id]
            );

            res
            .status(httpStatus.OK().code)
            .json(results[0]);
        } catch (error) {
            return next(error);
        }
    },
}

module.exports = departmentController;