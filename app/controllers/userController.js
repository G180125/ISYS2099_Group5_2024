const express = require("express");
const cookieParser = require("cookie-parser");
const express = require("express");
const db = require("../models/db.js");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");

const app = express();
app.use(cookieParser());

const validGenders = ["female", "male", "other"];

const userController = {
  getAllPatients: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10; 
      const offset = (page - 1) * limit;

      // Query to fetch patients with pagination
      const [results] = await db.poolAdmin.query(`SELECT * FROM patient LIMIT ? OFFSET ?`, [limit, offset]);

      // Optionally, fetch the total number of records for pagination metadata
      const [countResult] = await db.poolAdmin.query(`SELECT COUNT(*) as total FROM patient`);
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        results,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  getAllStaffs: async (req, res) => {
    try {
      const job_type = req.query.job_type;
      const department = req.query.department;
      const order = req.query.order || 'ASC';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      let query;
      let countQuery;
      let results;
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
        query = `SELECT * FROM staff WHERE jobtype = ? LIMIT ? OFFSET ?`;
        results = await db.poolStaff.query(query, [job_type, limit, offset]);
  
        countQuery = `SELECT COUNT(*) as total FROM staff WHERE jobtype = ?`;
        [countResult] = await db.poolStaff.query(countQuery, [job_type]);
  
      } else {
        query = `CALL list_staff_order_by_name(?)`;
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
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },
  
  
  getPatientByEmail: async (req, res) => {
    try {
      const email = req.body.email;
      const [results] = await db.poolPatient.query(
        `SELECT * FROM patient WHERE email = ?`,
        [email],
      );
      if (results.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND().code)
          .json({ error: httpStatus.NOT_FOUND("Patient not found").message });
      }
      return res.json(results[0]);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  getPatientByname: async (req, res) => {
    try {
      const first_name = req.query.first_name;
      const last_name = req.query.last_name;
      console.log(`first name: ${first_name}`);
      console.log(`last name: ${last_name}`);
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10; 
      const offset = (page - 1) * limit;
  
      if (!first_name && !last_name) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("Please provide the patient name for searching!").message });
      }
  
      const query = `CALL search_patient_by_name(?, ?, ?, ?)`;
      const [results] = await db.poolPatient.query(query, [first_name, last_name, limit, offset]);
  
      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
      }
  
      // Fetch total number of matching records for pagination metadata
      const countQuery = `SELECT COUNT(*) as total FROM patient WHERE first_name = ? AND last_name = ?`;
      const [countResult] = await db.poolPatient.query(countQuery, [first_name, last_name]);
      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);
  
      return res.json({
        results,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      });
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },
  
  getStaffByEmail: async (req, res) => {
    try {
      const email = req.body.email;
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

  updatePatient: async (req, res) => {
    console.log(req.params);
    try {
      const email = req.body.email;
      const { newFirstName, newLastName, newDOB, newGender } = req.body;

      // Validate DOB (not after today)
      if (newDOB && !moment(newDOB, 'YYYY-MM-DD', true).isBefore(moment())) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("The date of birth must be a valid date and not in the future").message });
      }

      // Validate gender
      if (newGender && !validGenders.includes(newGender.toLowerCase())) {
        return res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("Gender must be 'female', 'male', or 'other'").message });
      }

      // Prepare update query based on provided fields
      let updateQuery = 'UPDATE patient SET ';
      const updateFields = [];
      const updateValues = [];

      if (newFirstName) {
        updateFields.push('first_name = ?');
        updateValues.push(newFirstName);
      }
      if (newLastName) {
        updateFields.push('last_name = ?');
        updateValues.push(newLastName);
      }
      if (newDOB) {
        updateFields.push('dob = ?');
        updateValues.push(newDOB);
      }
      if (newGender) {
        updateFields.push('gender = ?');
        updateValues.push(newGender);
      }

      if (updateFields.length > 0) {
        updateQuery += updateFields.join(', ') + ' WHERE email = ?';
        updateValues.push(email);

        await db.poolPatient.query(updateQuery, updateValues);

        res.json({
          message: `Patient ${email} updated successfully`,
          email: email,
          first_name: newFirstName,
          last_name: newLastName,
          dob: newDOB,
          gender: newGender,
          role: "patient",
        });
      } else {
        res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST("No valid fields provided for update").message });
      }

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
      const staffId = req.params.staff_id;
      const { firstName, lastName, gender, jobType, departmentId, salary, managerId } = req.body;

      const query = `CALL update_staff(?, ?, ?, ?, ?, ?, ?)`;
      const results = await db.poolAdmin.query(query, [firstName, lastName, gender, jobType, departmentId, salary, managerId]);

      // Check for rollback message in the result
      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
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

  deletePatientByEmail: async (req, res) => {
    try {
      const email = req.bopdy.email;
      await db.poolAdmin.query(`DELETE FROM patient WHERE email = ?`, [
        email,
      ]);
      res
        .status(httpStatus.OK().code)
        .json(httpStatus.OK(`Patient member ${email} deleted successfully`, email).data);
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

module.exports = userController;
