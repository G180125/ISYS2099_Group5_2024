const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlClient = require("../databases/mysqlClient");
const models = require("../services/mysqlService");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { generateToken, setCookie } = require("../utils");
const httpStatus = require("../utils/httpStatus");

const app = express();
app.use(cookieParser());

const registerPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email, password").message });
    }

    let result = 0; 
    let message = '';
    let newPatientId = 0; 

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const pool = mysqlClient.getPool("patient");

    const query = `CALL register_patient(?, ?, ?, ?, ?, ?, ?, @result, @message, @newPatientId)`;
    const [rows] = await pool.query(query, [null, null, email, hashedPassword, null, 'O', null]);

    console.log(rows);

    result = rows[0][0].result;
    message = rows[0][0].message;
    newPatientId = rows[0][0].new_user_id;

    if (result == 0) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST(message).message });
    }

    req.id = newPatientId;
    req.role = 'patient';

    return res
      .status(httpStatus.OK().code)
      .json({ message: `User patient created with ID: ${newPatientId}` });
  } catch (err) {
    return next(err);
  }
};

const registerStaff = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !role || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email, password, and role").message });
    }

    let result = 0; 
    let message = ''; 
    let newStaffId = 0;

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    let query;
    let rows;

    const pool = mysqlClient.getPool("admin");

    if (role === "staff") {
      query = `CALL add_new_staff(?, ?, ?, ?, ?, ?, ?, ?, @result, @message, @newPatientId)`;
      [rows] = await pool.query(query, [null, null, email, hashedPassword, 'O', 'D', 1, 1]);
    } else if (role === "admin") {
      query = `CALL add_new_staff(?, ?, ?, ?, ?, ?, ?, ?, @result, @message, @newPatientId)`;
      [rows] = await pool.query(query, [null, null, email, hashedPassword, 'O', 'A', 1, 0]);
    } else {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Invalid role provided").message });
    }

    console.log(rows);

    result = rows[0][0].result;
    message = rows[0][0].message;
    newStaffId = rows[0][0].new_user_id;

    if (result == 0) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST(message).message });
    }

    req.role = role;
    req.id = newStaffId;

    return res
      .status(httpStatus.OK().code)
      .json({ message: `User ${role} created with id: ${newStaffId}` });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email and password").message });
    }

    const role = await models.getRoleByEmail(email);

    if (!role){
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED().message });
    }

    const user = await models.getUserByEmail(email);

    const passwordMatches = compareSync(password, user.password);

    if (!passwordMatches) {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("Invalid password").message });
    }

    const tokens = generateToken(user.user_id, role);
    setCookie(res, tokens.accessToken);

    req.role = role;
    req.id = user.patient_id;

    return res
      .status(httpStatus.OK().code)
      .json({ message: "User authenticated", tokens });
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const validRoles = ["patient", "staff", "admin"]; 

    // Check if the role is valid
    if (validRoles.includes(req.role)) {
      await models.deleteUserToken(req.id);
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("User not found").message });
    }

    // Clear the cookie
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res
      .status(httpStatus.OK().code)
      .json({ message: "User logged out" });
  } catch (err) {
    return next(err);
  }
};


module.exports = {
  registerPatient,
  registerStaff,
  login,
  logout,
};
