
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
            .json(results);
        } catch (error) {
            return next(error);
        }
    },

    getAllDoctorsByDepartment: async (req, res, next) => {
        try {
            const { department_name } = req.body;

            // Check if department_name is provided
            if (!department_name) {
            return res
                .status(httpStatus.BAD_REQUEST().code)
                .json({ error: httpStatus.BAD_REQUEST("No Input For Department").message });
            }

            const pool = mysqlClient.getPool("patient");

            // Execute query to fetch doctors by department name
            const [results] = await pool.query(
            `
            SELECT S.first_name, S.last_name, D.department_name
            FROM staff S
            JOIN department D ON S.department_id = D.department_id
            WHERE S.job_type = 'D' AND D.department_name = ?
            `,
            [department_name]
            );

            res
            .status(httpStatus.OK().code)
            .json(results);
        } catch (error) {
            return next(error);
        }
    },
}

module.exports = departmentController;