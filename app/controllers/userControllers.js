require("express");
const db = require("../models/db.js");
const moment = require('moment'); 

const validGenders = ["female", "male", "other"];

const patientController = {
  getAllPatients: async (req, res) => {
    try {
      const [results] = await db.pool.query(`SELECT * FROM patient`);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAllStaffs: async (req, res) => {
    try {
      const [results] = await db.pool.query(`SELECT * FROM staff`);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getPatientByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const [results] = await db.pool.query(
        `SELECT * FROM patient WHERE email = ?`,
        [email],
      );
      if (results.length === 0) {
        return res.status(404).json({
          error: `No Patient Found with the email: ${email}`,
          email: email,
          role: "patient",
        });
      }
      return res.json(results[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getStaffByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const [results] = await db.pool.query(
        `SELECT * FROM staff WHERE email = ?`,
        [email],
      );
      if (results.length === 0) {
        return res.status(404).json({
          error: `No Patient Found with the email: ${email}`,
          email: email,
          role: "staff",
        });
      }
      return res.json(results[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updatePatient: async (req, res) => {
    console.log(req.params);
    try {
      const email = req.params.email;
      const { newFirstName, newLastName, newDOB, newGender } = req.body;
  
      // Validate DOB (not after today)
      if (newDOB && !moment(newDOB, 'YYYY-MM-DD', true).isBefore(moment())) {
        throw new Error("The date of birth must be a valid date and not in the future");
      }
  
      // Validate gender
      if (newGender && !validGenders.includes(newGender.toLowerCase())) {
        throw new Error("Gender must be 'female', 'male', or 'other'");
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
  
        await db.pool.query(updateQuery, updateValues);
  
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
        res.status(400).json({ error: "No valid fields provided for update" });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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
        results = await db.pool.query(query, [staffId, managerId, firstName, lastName, jobType, departmentId, salary]);
      } else {
        // Call the stored procedure to update the staff's own information
        query = `CALL update_my_info(?, ?, ?)`;
        results = await db.pool.query(query, [staffId, firstName, lastName]);
      }
  
      // Check for rollback message in the result
      const errorMessage = results[0]?.[0]?.message;
      if (errorMessage) {
        res.status(400).json({ error: errorMessage });
      } else {
        res.json({
          message: `Staff ${staffId} updated successfully`,
          staff_id: staffId,
          manager_id: managerId || null,
          first_name: firstName,
          last_name: lastName,
          job_type: jobType || null,
          department_id: departmentId || null,
          salary: salary || null,
        });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  
  // Delete a buyer by username
  deletePatientByEmail: async (req, res) => {
    try {
      const email = req.email;
      await db.pool.query(`DELETE FROM patient WHERE email = ?`, [
        email,
      ]);
      res.json({
        message: `Patient ${email} deleted successfully`,
        email: email,
        role: "admin",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete a wh admin by username
  deleteStaffByEmail: async (req, res) => {
    try {
      const email = req.email;
      await db.pool.query(`DELETE FROM staff WHERE email = ?`, [
        email,
      ]);
      res.json({
        message: `Staff member ${email} deleted successfully`,
        email: email,
        role: "admin",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

};

module.exports = patientController;