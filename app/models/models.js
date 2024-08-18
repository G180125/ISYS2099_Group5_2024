const db = require("./db.js");

let database = {};

database.getPatient = async (email) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM patient WHERE email = ?`,
      [email]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.deletePatientToken = async (email) => {
  try {
    await db.poolPatient.query(
      `UPDATE patient SET refresh_token = NULL WHERE email = ?`,
      [email]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getStaff = async (email) => {
  try {
    const [results] = await db.poolStaff.query(
      `SELECT * FROM staff WHERE email = ? AND job_type <> 'A'`,
      [email]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getStaffId = async (email) => {
  try {
    const [results] = await db.poolStaff.query(
      `SELECT staff_id FROM staff WHERE email = ?`,
      [email]
    );
    return results.length > 0 ? results[0].staff_id : null;
  } catch (error) {
    console.error('Error fetching staff ID by email:', error);
    throw error;
  }
};

database.deleteStaffToken = async (email) => {
  try {
    await db.poolStaff.query(
      `UPDATE staff SET refresh_token = NULL WHERE email = ? AND job_type <> 'A'`,
      [email]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getAdmin = async (email) => {
  try {
    const [results] = await db.poolAdmin.query(
      `SELECT * FROM staff WHERE email = ? AND job_type='A'`,
      [email]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.deleteAdminToken = async (email) => {
  try {
    await db.poolAdmin.query(
      `UPDATE staff SET refresh_token = NULL WHERE email = ? AND job_type='A'`,
      [email]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getUserByRole = async (role, email) => {
  if (role === "patient") {
    return database.getPatient(email);
  } else if (role === "staff") {
    return database.getStaff(email);
  } else if (role === "admin") {
    return database.getAdmin(email);
  }
};

module.exports = database;
