const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");
const mysqlService = require("../services/mysqlService");
const { introspect } = require("../utils");
const app = express();
app.use(cookieParser());

const ticketController = {
    createTicket: async (req, res) => {
        try {
            const { accessToken } = req.cookies;
            const payload = introspect(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // Check if the staff ID is valid
            const staffEmail = payload.email;
            const staffId = await mysqlService.getStaffId(staffEmail);
            if (!staffId) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("Invalid staff ID").message });
            }

            const {newSalary, newJobType, newDepartmentID } = req.body;
            // Set default values to NULL if they are not provided
            const salary = newSalary !== undefined && newSalary !== '' ? newSalary : null;
            const jobType = newJobType !== undefined && newJobType !== '' ? newJobType : null;
            const departmentID = newDepartmentID !== undefined && newDepartmentID !== '' ? newDepartmentID : null;

            const query = `
                CALL create_ticket_for_update(?, ?, ?, ?, @result, @message);
            `;

            const [rows] = await mysqlClient.poolStaff.query(query, [
                staffId, salary, jobType, departmentID
            ]);

            const message = rows[0][0].message;
            const result = rows[0][0].result;
            console.log(rows);

            if (result == 0) {
                return res
                  .status(httpStatus.BAD_REQUEST().code)
                  .json({ error: httpStatus.BAD_REQUEST(message).message });
              }

            return res
                .status(httpStatus.OK().code)
                .json({ message: message });
            

        } catch (error) {
            console.error('Error in createTicket:', error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: error.message });
        }
    }
};

module.exports = ticketController;
