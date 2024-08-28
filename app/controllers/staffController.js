
const cookieParser = require("cookie-parser");
const express = require("express");
const { db, models } = require("../models");
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
        results = await db.poolStaff.query(query, [department, job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE department_id = ? AND jobtype = ?`;
        [countResult] = await db.poolStaff.query(countQuery, [department, job_type]);
      } else if (department) {
        query = `CALL list_staff_by_department(?, ?, ?, ?)`;
        results = await db.poolStaff.query(query, [department, null, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE department_id = ?`;
        [countResult] = await db.poolStaff.query(countQuery, [department]);
      } else if (job_type) {
        query = `SELECT * FROM staff WHERE jobtype = ? ORDER BY name ${order} LIMIT ? OFFSET ?`;
        results = await db.poolStaff.query(query, [job_type, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff WHERE jobtype = ?`;
        [countResult] = await db.poolStaff.query(countQuery, [job_type]);
      } else {
        query = `CALL list_staff_order_by_name(?, ?, ?)`;
        results = await db.poolStaff.query(query, [order, limit, offset]);

        countQuery = `SELECT COUNT(*) as total FROM staff`;
        [countResult] = await db.poolStaff.query(countQuery);
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
  
  getStaffByEmail: async (req, res) => {
    try {
      const email = req.body.email;

      if(!email || email == ""){
        return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("No Input For Email").message });
    }

      const [results] = await db.poolStaff.query(
        `SELECT * FROM staff WHERE email = ?`,
        [email],
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
    console.log(req.params);
    try {
      const { email, firstName, lastName, gender, jobType, departmentId, salary, managerId } = req.body;

      if(!email || email == ""){
          return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("No Input For Email").message });
      }

      if (salary && salary < 0) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("Salary must be a positive number").message });
      }

      let result = 0; 
      let message = ''; 

      const query = `CALL update_staff(?, ?, ?, ?, ?, ?, ?, @result, @message)`;
      const [rows] = await db.poolAdmin.query(query, [email, firstName, lastName, gender, jobType, departmentId, salary, managerId]);

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
          .json(httpStatus.OK(`Staff ${staffId} updated successfully`, responseData).data);
      }
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  deleteStaffByEmail: async (req, res) => {
    try {
      const email = req.body.email;
      await db.poolAdmin.query(`DELETE FROM staff WHERE email = ?`, [
        email,
      ]);
      res
        .status(httpStatus.OK().code)
        .json(httpStatus.OK(`Staff member ${email} deleted successfully`, email).data);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },
};

module.exports = staffController;
