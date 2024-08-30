const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");
const mysqlService = require("../services/mysqlService");
const app = express();
app.use(cookieParser());

const ticketController = {
    createTicket: async (req, res) => {
        try {
            // const { email } = req.cookies;
            const { staffId, newSalary, newJobType, newDepartmentID } = req.body;

            // Check if the staff ID is valid
            // const staffIdFromDb = await mysqlService.getStaffId(email);
            // if (!staffIdFromDb) {
            //     return res
            //         .status(httpStatus.BAD_REQUEST().code)
            //         .json({ error: httpStatus.BAD_REQUEST("No Staff member found to make the request").message });
            // }

            // Set default values to NULL if they are not provided
            const salary = newSalary !== undefined && newSalary !== '' ? newSalary : null;
            const jobType = newJobType !== undefined && newJobType !== '' ? newJobType : null;
            const departmentID = newDepartmentID !== undefined && newDepartmentID !== '' ? newDepartmentID : null;

            const query = `
                CALL create_ticket_for_update(?, ?, ?, ?, @result, @message);
            `;

            const [resultSet] = await mysqlClient.poolStaff.query(query, [
                staffId, salary, jobType, departmentID
            ]);

            // Check for rollback message in the result
            const result = resultSet[1]?.[0];
            
            const errorMessage = result?.message;
            const operationResult = result?.result;

            if (operationResult === 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: httpStatus.OK(`Ticket created Successfully`).message });

        } catch (error) {
            console.error('Error in createTicket:', error);
            res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    }
};

module.exports = ticketController;
