const express = require("express");
const db = require("../models/db.js");
const moment = require('moment');
const httpStatus = require("../utils/httpStatus.js");

const validGenders = ["female", "male", "other"];

const userController = {
  getAllPatients: async (req, res) => {
    try {
      const [results] = await db.poolAdmin.query(`SELECT * FROM patient`);
      res.json(results);
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
      let results;
      if (job_type && department) {
        results = await db.poolPatient.query(
          `SELECT * FROM staff WHERE job_type = ? AND department_id = ?`,
          [job_type, department]
        );
      } else if (job_type) {
        results = await db.poolPatient.query(
          `SELECT * FROM staff WHERE job_type = ?`,
          [job_type]
        );
      } else if (department) {
        results = await db.poolPatient.query(
          `SELECT * FROM staff WHERE department_id = ?`,
          [department]
        );
      } else {
        results = await db.poolPatient.query(`SELECT * FROM staff`);
      }
      res.json(results);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  },

  getPatientByEmail: async (req, res) => {
    try {
      const email = req.params.email;
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

  getStaffByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const [results] = await db.poolPatient.query(
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
      const email = req.params.email;
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
      const { managerId, firstName, lastName, jobType, departmentId, salary } = req.body;

      let query;
      let results;

      // Determine if managerId is provided to decide which stored procedure to call
      if (managerId) {
        // Call the stored procedure to update staff by manager
        query = `CALL update_staff_by_manager(?, ?, ?, ?, ?, ?, ?)`;
        results = await db.poolAdmin.query(query, [staffId, managerId, firstName, lastName, jobType, departmentId, salary]);
      } else {
        // Call the stored procedure to update the staff's own information
        query = `CALL update_my_info(?, ?, ?)`;
        results = await db.poolAdmin.query(query, [staffId, firstName, lastName]);
      }

      // Check for rollback message in the result
      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        res
          .status(httpStatus.BAD_REQUEST().code)
          .json({ error: httpStatus.BAD_REQUEST(errorMessage).message });
      } else {
        const responseData = {
          staff_id: staffId,
          manager_id: managerId || null,
          first_name: firstName,
          last_name: lastName,
          job_type: jobType || null,
          department_id: departmentId || null,
          salary: salary || null,
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
      const email = req.params.email;
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
      const email = req.params.email;
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
