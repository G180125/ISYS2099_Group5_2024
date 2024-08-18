const express = require("express");
const cookieParser = require("cookie-parser");
const express = require("express");
const { db, models } = require("../models"); 
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const ticketController = {
    createTicket: async (req, res) => {
        try {
        const { email, role } = req.cookies;
        const { managerId, firstName, lastName, gender, jobType, departmentId, salary } = req.body;

        if(!models.getStaffId(email)){
            res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST("No Staff member found to make the request").message });
        }

        const createdDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); 
            const day = String(today.getDate()).padStart(2, '0');
        
            return `${year}-${month}-${day}`;
        }

        const status = role === "admin" ? 'A' : 'P';

        const query = `
            INSERT INTO ticket (
            first_name, last_name, gender, job_type, department_id, salary, manager_id,
            creator, created_date, handled_by, status, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.poolStaff.query(query, [
            firstName, lastName, gender, jobType, departmentId, salary,
            managerId, staffIdFromEmail, createdDate, null, status, null
        ]);

        // Check for rollback message in the result
        const errorMessage = result[0]?.[0]?.message;
        if (errorMessage) {
            res
            .status(httpStatus.BAD_REQUEST().code)
            .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
        } 

        res
            .status(httpStatus.OK().code)
            .json(httpStatus.OK(`Ticket created Successfully`).message);

        } catch (error) {
        console.error(error);
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
        }
    }
};

module.exports = ticketController;