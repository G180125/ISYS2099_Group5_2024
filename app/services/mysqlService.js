const db = require("../databases/mysqlClient");

let database = {};

database.getUserById = async (id) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM user WHERE ID = ?`,
      [id]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getUserByEmail = async (email) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );
    return results[0];
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.deleteUserToken = async (id) => {
  try {
    await db.poolPatient.query(
      `UPDATE user SET access_token = NULL WHERE user_id = ?`,
      [id]
    );
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

database.getRoleByEmail = async (email) => {
  try {
    const [rows] = await db.poolPatient.query(
      `CALL get_user_role_by_email(?, @role, @message)`,
      [email]
    );
    const role = rows[0][0].role;
    const message = rows[0][0].message;

    return role, message;
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

module.exports = database;
