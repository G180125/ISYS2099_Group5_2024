
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
            const department_id = req.params.id;

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
            .json(results);
        } catch (error) {
            return next(error);
        }
    },

    updateDepartment: async (req, res, next) => {
        try {
            const role = req.role;
            const { department_id, department_name, manager_id } = req.body;
    
            // Check if both department_name and manager_id are null
            if (!department_name && !manager_id) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: "At least one attribute (department_name or manager_id) must be provided." });
            }
    
            const pool = mysqlClient.getPool(role);
    
            // Dynamically build the query based on provided attributes
            let updateQuery = 'UPDATE department SET';
            const queryParams = [];
            
            if (department_name) {
                updateQuery += ' department_name = ?,';
                queryParams.push(department_name);
            }
    
            if (manager_id) {
                updateQuery += ' manager_id = ?,';
                queryParams.push(manager_id);
            }
    
            // Remove trailing comma and add WHERE clause
            updateQuery = updateQuery.slice(0, -1); // Remove the last comma
            updateQuery += ' WHERE department_id = ?';
            queryParams.push(department_id);
    
            // Execute the update query
            const [results] = await pool.query(updateQuery, queryParams);
    
            // Check if any rows were updated
            if (results.affectedRows === 0) {
                return res
                    .status(httpStatus.NOT_FOUND().code)
                    .json({ error: "No department found or No manager found." });
            }
    
            return res
                .status(httpStatus.OK().code)
                .json({ message: "Department updated successfully." });
    
        } catch (error) {
            return next(error);
        }
    },    
}

module.exports = departmentController;