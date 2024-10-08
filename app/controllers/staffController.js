
const mysqlClient = require("../databases/mysqlClient");
const httpStatus = require("../utils/httpStatus.js");

const validGenders = ["F", "M", "O"];
const validjob_types = ["D", "N", "A"];

const staffController = {
  getAllStaffs: async (req, res, next) => {
    try {
      const role = req.role;
      const job_type = req.query.job_type;
      const department = req.query.department;
      const order = req.query.order || 'ASC';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      let query;
      let results;
      let countQuery;
      let countResult;

      const pool = mysqlClient.getPool(role);
  
      if (job_type && department) {
        query = `CALL list_staff_by_department(?, ?, ?, ?)`;
        results = await pool.query(query, [department, job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff_secure_report WHERE department_id = ? AND job_type = ?`;
        [countResult] = await pool.query(countQuery, [department, job_type]);
      } else if (department) {
        query = `CALL list_staff_by_department(?, ?, ?, ?)`;
        results = await pool.query(query, [department, null, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff_secure_report WHERE department_id = ?`;
        [countResult] = await pool.query(countQuery, [department]);
      } else if (job_type) {
        query = `SELECT * FROM staff_secure_report WHERE job_type = ? LIMIT ? OFFSET ?`;
        results = await pool.query(query, [job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff_secure_report WHERE job_type = ?`;
        [countResult] = await pool.query(countQuery, [job_type]);
      } else {
        query = `CALL list_staff_order_by_name(?, ?, ?)`;
        results = await pool.query(query, [order, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff_secure_report`;
        [countResult] = await pool.query(countQuery);
      }
  
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
  
      res.json({
        results: results[0][0],
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

  getAllDoctors: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10; 
      const offset = (page - 1) * limit;

      const pool = mysqlClient.getPool("patient");

      const query = `
        SELECT S.first_name, S.last_name, S.department_name, S.staff_id
        FROM staff_secure_report S
        WHERE S.job_type = 'D'
        LIMIT ? OFFSET ?;`;

      const [results] = await pool.query(query, [limit, offset]);

      const [countResult] = await pool.query(`
          SELECT COUNT(*) as total
          FROM staff_secure_report S
          WHERE S.job_type = 'D'`);
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
  
  getMyInfo: async (req, res, next) => {
    try {
      const id = req.id;
      const role = req.role;
      if(!id || id == ""){
        return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
      }

      const pool = mysqlClient.getPool(role);

      const [results] = await pool.query(
        `SELECT 
          S.user_id staff_id,
          U.first_name,
          U.last_name,
          U.email,
          U.gender,
          S.job_type,
          S.salary,
          D.department_id,
          D.department_name,
          D.manager_id
        FROM staff S
        JOIN user U ON U.user_id = S.user_id
        LEFT JOIN department D ON S.department_id = D.department_id WHERE S.user_id = ?`,
        [id],
      );
      if (results.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("Staff not found").message });
      }
      return res.json(results[0]);
    } catch (error) {
      return next(error);
    }
  },

  getStaffById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const role = req.role;
      if(!id || id == ""){
        return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
      }

      const pool = mysqlClient.getPool(role);

      const [results] = await pool.query(
        `SELECT 
            S.user_id staff_id,
            U.first_name,
            U.last_name,
            U.email,
            U.gender,
            S.job_type,
            D.department_id,
            D.department_name,
            D.manager_id
        FROM staff S
        JOIN user U ON U.user_id = S.user_id
        LEFT JOIN department D ON S.department_id = D.department_id WHERE S.user_id = ?`,
        [id],
      );
      if (results.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("Staff not found").message });
      }
      return res.json(results[0]);
    } catch (error) {
      return next(error);
    }
  },

  updateMyInfo: async (req, res, next) => {
    try {
      const id = req.id;
      const role = req.role;
      const { firstName, lastName, gender, job_type, departmentId, salary } = req.body;

      if(!id || id == ""){
          return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("Unanthentication").message });
      }

      if (salary && salary < 0) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("Salary must be a positive number").message });
      }

      let result = 0; 
      let message = ''; 

      const pool = mysqlClient.getPool(role);

      const query = `CALL update_staff(?, ?, ?, ?, ?, ?, ?, @result, @message)`;
      const [rows] = await pool.query(query, [id, firstName, lastName, gender, job_type, departmentId, salary]);

      result = rows[0][0].result;
      message = rows[0][0].message;
      console.log("result: " , result);
      console.log("message: " , message);

      if (result == 0) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(message).message });
      } 
      
      return res
        .status(httpStatus.OK().code)
        .json({
          message : message
        });
      // else {
      
      //   const responseData = {
      //     first_name: firstName,
      //     last_name: lastName,
      //     gender: gender,
      //     job_type: job_type || null,
      //     department_id: departmentId || null,
      //     salary: salary || null
      //   };
      //   res
      //     .status(httpStatus.OK().code)
      //     .json(httpStatus.OK(`Staff ${id} updated successfully`, responseData).data);
      // }
    } catch (error) {
      return next(error);
    }
  },

  deleteStaffById: async (req, res, next) => {
    try {
      const id = req.body.id;
      const role = req.role;

      const pool = mysqlClient.getPool(role);
      await pool.query(`DELETE FROM user WHERE user_id = ?`, [
        id,
      ]);
      res
        .status(httpStatus.OK().code)
        .json(httpStatus.OK(`Staff member deleted successfully`).data);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = staffController;
