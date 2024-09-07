const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

const ticketController = {
    getAllTickets: async (req, res, next) => {
        try {
            const role = req.role;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const pool = mysqlClient.getPool(role);

            const query = `
                SELECT * FROM staff_job_change_report
                LIMIT ? OFFSET ?;
            `;

            const [results] = await pool.query(query, [limit, offset]);

            const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM staff_job_change_report`);
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            res.json({
                results: results,
                pagination: {
                    totalRecords: totalRecords,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit,
                }
            });
        } catch (error) {
            return next(error);
        }
    },

    getMyTickets: async (req, res, next) => {
        try {
            const role = req.role;
            const id = req.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const pool = mysqlClient.getPool(role);

            const query = `
                SELECT * FROM staff_job_change_report
                WHERE staff_id = ?
                LIMIT ? OFFSET ?;
            `;

            const [results] = await pool.query(query, [id, limit, offset]);

            const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM staff_job_change_report WHERE staff_id = ?;`, [id]);
            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            res.json({
                results,
                pagination: {
                    totalRecords: totalRecords,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit,
                }
            });
        } catch (error) {
            return next(error);
        }
    },

    createTicket: async (req, res, next) => {
        try {
            const staffId = req.id;
            const role = req.role;
            const { newFirstName, newLastName, newGender, newSalary, newJobType, newDepartmentID, notes } = req.body;

            if (!staffId) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("Invalid staff ID").message });
            }

            const pool = mysqlClient.getPool(role);

            const query = `
                CALL create_ticket_for_update(?, ?, ?, ?, ?, ?, ?, ?, @result, @message);
            `;

            const [rows] = await pool.query(query, [
                staffId, newFirstName, newLastName, newGender, newSalary, newJobType, newDepartmentID, notes
            ]);

            console.log(rows);

            const message = rows[0][0].message;
            const result = rows[0][0].result;

            if (result == 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: message });
        } catch (error) {
            return next(error);
        }
    },

    updateTicket: async (req, res, next) => {
        try {
            const staffId = req.id;
            const role = req.role;
            const { ticketId, newFirstName, newLastName, newGender, newSalary, newJobType, newDepartmentID, notes } = req.body;

            if (!staffId) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("Invalid staff ID").message });
            }

            const pool = mysqlClient.getPool(role);

            const query = `
                CALL update_ticket_for_update(?, ?, ?, ?, ?, ?, ?, ?, ?, @result, @message);
            `;

            const [rows] = await pool.query(query, [
                ticketId, staffId, newFirstName, newLastName, newGender, newSalary, newJobType, newDepartmentID, notes
            ]);
            // console.log(rows);
            const message = rows[1][0].message;
            const result = rows[1][0].result;

            if (result == 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: message });
        } catch (error) {
            return next(error);
        }
    },

    approveTicket: async (req, res, next) => {
        try {
            const adminId = req.id;
            const role = req.role;
            const { ticket_id } = req.params;

            if (!ticket_id) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("Invalid number of input").message });
            }

            const pool = mysqlClient.getPool(role);

            const query = `
                CALL approve_ticket_for_update(?, ?, @result, @message);
            `;

            const [rows] = await pool.query(query, [
                ticket_id, adminId
            ]);

            const message = rows[0][0].message;
            const result = rows[0][0].result;

            if (result == 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: 'Ticket approval successfully!' });
        } catch (error) {
            return next(error);
        }
    },

    rejectTicket: async (req, res, next) => {
        try {
            const adminId = req.id;
            const role = req.role;
            const { ticket_id } = req.params;
            const { note } = req.body;

            if (!ticket_id || !note) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("Invalid number of input").message });
            }

            const pool = mysqlClient.getPool(role);

            const query = `
                CALL reject_ticket_for_update(?, ?, ?, @result, @message);
            `;

            const [rows] = await pool.query(query, [
                ticket_id, adminId, note
            ]);

            const message = rows[0][0].message;
            const result = rows[0][0].result;

            if (result == 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: 'Reject Ticket Successfully' });
        } catch (error) {
            return next(error);
        }
    },

    deleteTicket: async (req, res, next) => {
        try {
            const { ticketId } = req.body;
            const role = req.role;
            if (!ticketId) {
                return res
                    .status(httpStatus.UNAUTHORIZED().code)
                    .json({ error: httpStatus.UNAUTHORIZED("No input for ticket ID").message });
            }

            const pool = mysqlClient.getPool(role);

            const query = `
                CALL delete_ticket_for_update(?, @result, @message);
            `;

            const [rows] = await pool.query(query, [
                ticketId
            ]);

            const message = rows[0][0].message;
            const result = rows[0][0].result;

            if (result == 0) {
                return res
                    .status(httpStatus.BAD_REQUEST().code)
                    .json({ error: httpStatus.BAD_REQUEST(message).message });
            }

            return res
                .status(httpStatus.OK().code)
                .json({ message: 'Delete Successfully' });
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = ticketController;