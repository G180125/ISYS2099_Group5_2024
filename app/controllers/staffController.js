
const cookieParser = require("cookie-parser");
const express = require("express");
const mysqlClient = require("../databases/mysqlClient");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const validGenders = ["F", "M", "O"];
const validJobTypes = ["D", "N", "A"];

const staffController = {
  getAllStaffs: async (req, res) => {
    try {
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
  
      if (job_type && department) {
        query = `CALL list_staff_by_department_and_jobtype(?, ?, ?, ?)`;
        results = await mysqlClient.poolStaff.query(query, [department, job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE department_id = ? AND jobtype = ?`;
        [countResult] = await mysqlClient.poolStaff.query(countQuery, [department, job_type]);
      } else if (department) {
        query = `CALL list_staff_by_department(?, ?, ?, ?)`;
        results = await mysqlClient.poolStaff.query(query, [department, null, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE department_id = ?`;
        [countResult] = await mysqlClient.poolStaff.query(countQuery, [department]);
      } else if (job_type) {
        query = `SELECT * FROM staff WHERE jobtype = ? ORDER BY name ${order} LIMIT ? OFFSET ?`;
        results = await mysqlClient.poolStaff.query(query, [job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE jobtype = ?`;
        [countResult] = await mysqlClient.poolStaff.query(countQuery, [job_type]);
      } else {
        query = `CALL list_staff_order_by_name(?, ?, ?)`;
        results = await mysqlClient.poolStaff.query(query, [order, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff`;
        [countResult] = await mysqlClient.poolStaff.query(countQuery);
      }
  
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
  
      res.json({
        results: results[0],
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllDoctors: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10; 
      const offset = (page - 1) * limit;

        const [results] = await db.poolPatient.query(`
        SELECT S.first_name, S.last_name, D.department_name
        FROM staff S
        JOIN department D ON S.department_id = D.department_id
        WHERE S.job_type = 'D'`);
        
        res
        .status(httpStatus.OK().code)
        .json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
},
  
  getMyInfo: async (req, res) => {
    try {
      const id = req.id;

      if(!id || id == ""){
        return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
    }

      const [results] = await mysqlClient.poolStaff.query(
        `SELECT * FROM staff WHERE staff_id = ?`,
        [id],
      );
      if (results.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("Staff not found").message });
      }
      return res.json(results[0]);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  getStaffById: async (req, res) => {
    try {
      const id = req.body.id;

      if(!id || id == ""){
        return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Unauthentication").message });
    }

      const [results] = await mysqlClient.poolStaff.query(
        `SELECT * FROM staff WHERE staff_id = ?`,
        [id],
      );
      if (results.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("Staff not found").message });
      }
      return res.json(results[0]);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  updateStaff: async (req, res) => {
    try {
      const id = req.id;
      const { firstName, lastName, gender, jobType, departmentId, salary, managerId } = req.body;

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

      const query = `CALL update_staff(?, ?, ?, ?, ?, ?, ?, @result, @message)`;
      const [rows] = await mysqlClient.poolAdmin.query(query, [id, firstName, lastName, gender, jobType, departmentId, salary, managerId]);

      result = rows[0][0].result;
      message = rows[0][0].message;
      console.log("result: " , result);
      console.log("message: " , message);

      if (result == 0) {
        res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(message).message });
      } else {
        const responseData = {
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          job_type: jobType || null,
          department_id: departmentId || null,
          salary: salary || null,
          manager_id: managerId || null,
        };
        res
          .status(httpStatus.OK().code)
          .json(httpStatus.OK(`Staff ${staff_id} updated successfully`, responseData).data);
      }
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  deleteStaffById: async (req, res) => {
    try {
      const id = req.body.id;
      await mysqlClient.poolAdmin.query(`DELETE FROM staff WHERE staff_id = ?`, [
        id,
      ]);
      res
        .status(httpStatus.OK().code)
        .json(httpStatus.OK(`Staff member deleted successfully`).data);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },
};

module.exports = staffController;
