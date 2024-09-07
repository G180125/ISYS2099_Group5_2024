const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

const scheduleController = {
  getAllSchedules: async (req, res, next) => {
    try {
      const role = req.role;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const pool = mysqlClient.getPool(role);

      // Query to fetch patients with pagination
      const [results] = await pool.query(
        `
        SELECT S.staff_id, 
          S.schedule_date, 
          ST.first_name, 
          ST.last_name, 
          ST.email, 
          ST.gender, 
          ST.job_type, 
          D.department_name
        FROM schedule S 
        JOIN staff_secure_report ST ON S.staff_id = ST.staff_id
        JOIN department D ON ST.department_id = D.department_id
        LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      // Optionally, fetch the total number of records for pagination metadata
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM schedule`
      );
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results: results,
        pagination: {
          totalRecords: totalRecords,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllSchedulesByStaff: async (req, res, next) => {
    try {
      const role = req.role;
      const staffId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100000;
      const offset = (page - 1) * limit;

      const pool = mysqlClient.getPool(role);

      const query = `CALL view_staff_schedule(?, ?, ?)`;
      const results = await pool.query(query, [
        staffId,
        limit,
        offset,
      ]);

      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
      }

      res.json({
        results: results[0][0],
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllSchedulesOfDoctors: async (req, res, next) => {
    try {
      const role = req.role;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const pool = mysqlClient.getPool(role);

      const query = `SELECT * FROM doctor_free_slot_report LIMIT ? OFFSET ?`;
      const results = await pool.query(query, [
        limit,
        offset,
      ]);

      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
      }

      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM doctor_free_slot_report`
      );
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results: results[0],
        pagination: {
          totalRecords: totalRecords,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllSchedulesOfDoctorById: async (req, res, next) => {
    try {
      const role = req.role;
      const id = req.params.id;

      const pool = mysqlClient.getPool(role);

      const query = `SELECT * FROM doctor_free_slot_report WHERE staff_id = ?`;
      const results = await pool.query(query, [id]);

      if (results[0].length == 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("No Data Found").message });
      }

      res.json({
        results: results[0]
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = scheduleController;
