const { log } = require("console");
const db = require("../databases/mysqlClient");

let database = {};

database.hasToken = async (access_token) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM access_token WHERE access_token = ?`,
      [access_token]
    );
    
    if (results.length > 0 && results[0].access_token != null){
      return true;
    } 

    return false;
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getUserById = async (id) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM user WHERE user_id = ?`,
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

database.deleteToken = async (access_token) => {
  try {
    await db.poolPatient.query(
      `DELETE FROM access_token where access_token = ?`,
      [access_token]
    );
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

database.getPatientByID = async (id) => {
  try {
    const [results] = await db.poolPatient.query(
      `SELECT * FROM patient WHERE user_id = ?`,
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
      `SELECT * FROM staff_secure_report WHERE staff_id = ? AND job_type <> 'A'`,
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
      `SELECT * FROM staff_secure_report WHERE staff_id = ? AND job_type='A'`,
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

    console.log(rows);

    const role = rows[0][0].role;
    const message = rows[0][0].message;

    return role;
  } catch (err) {
    console.error("error: " + err.stack);
    throw err;
  }
};

module.exports = database;
