const db = require("../databases/mysqlClient");

let database = {};

database.getPatientByEmail = async (email) => {
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

database.getPatientByID = async (id) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM patient WHERE patient_id = ?`,
      [id]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.deletePatientToken = async (id) => {
  try {
    await db.poolPatient.query(
      `UPDATE patient SET access_token = NULL WHERE patient_id = ?`,
      [id]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getStaffByEmail = async (email) => {
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

database.getStaffByID = async (id) => {
  try {
    const [results] = await db.poolStaff.query(
      `SELECT * FROM staff WHERE staff_id = ? AND job_type <> 'A'`,
      [id]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};


database.deleteStaffToken = async (id) => {
  try {
    await db.poolStaff.query(
      `UPDATE staff SET access_token = NULL WHERE staff_id = ? AND job_type <> 'A'`,
      [id]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getAdminByEmail = async (email) => {
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

database.getAdminByID = async (id) => {
  try {
    const [results] = await db.poolAdmin.query(
      `SELECT * FROM staff WHERE staff_id = ? AND job_type='A'`,
      [id]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.deleteAdminToken = async (id) => {
  try {
    await db.poolAdmin.query(
      `UPDATE staff SET access_token = NULL WHERE staff_id = ? AND job_type='A'`,
      [id]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getUserByRole = async (role, id) => {
  if (role === "patient") {
    return database.getPatientByID(id);
  } else if (role === "staff") {
    return database.getStaffByID(id);
  } else if (role === "admin") {
    return database.getAdminByID(id);
  }
};

module.exports = database;
