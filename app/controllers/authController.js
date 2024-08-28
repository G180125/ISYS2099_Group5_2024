const express = require("express");
const cookieParser = require("cookie-parser");
const { db, models } = require("../models");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { generateToken, setCookie } = require("../utils");
const httpStatus = require("../utils/httpStatus");

const app = express();
app.use(cookieParser());

const registerPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email, password").message });
    }

    let result = 0; 
    let message = ''; 

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const query = `CALL register_patient(?, ?, ?, ?, ?, ?, ?, @result, @message)`;
    const [rows] = await db.poolPatient.query(query, [null, null, email, hashedPassword, null, 'O', null]);

    console.log(rows);

    result = rows[0][0].result;
    message = rows[0][0].message;
    console.log("result: " , result);
    console.log("message: " , message);

    if (result == 0) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST(message).message });
    }

    req.email = email;
    req.role = 'patient';

    return res
      .status(httpStatus.OK().code)
      .json({ message: `User patient created with email: ${email}` });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

const registerStaff = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !role || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email, password, and role").message });
    }

    let result = 0; 
    let message = ''; 

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    let query;
    let rows;

    if (role === "staff") {
      query = `CALL add_new_staff(?, ?, ?, ?, ?, ?, ?, ?, ?, @result, @message)`;
      [rows] = await db.poolAdmin.query(query, [null, null, email, hashedPassword, 'O', 'D', 1, 1, 1]);
    } else if (role === "admin") {
      query = `CALL add_new_staff(?, ?, ?, ?, ?, ?, ?, ?, ?, @result, @message)`;
      [rows] = await db.poolAdmin.query(query, [null, null, email, hashedPassword, 'O', 'A', 1, 0, 1]);
    } else {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Invalid role provided").message });
    }

    result = rows[0][0].result;
    message = rows[0][0].message;
    console.log("result: " , result);
    console.log("message: " , message);

    if (result == 0) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST(message).message });
    }

    req.role = role;
    req.email = email;

    return res
      .status(httpStatus.OK().code)
      .json({ message: `User ${role} created with email: ${email}` });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email and password").message });
    }

    let role, user;

    user = await models.getPatient(email);
    if (user) {
      role = "patient";
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("User not found").message });
    }

    const passwordMatches = compareSync(password, user.password);

    if (!passwordMatches) {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("Invalid password").message });
    }

    const tokens = generateToken(email, role);
    setCookie(res, tokens.accessToken);

    req.role = role;
    req.email = email;

    return res
      .status(httpStatus.OK().code)
      .json({ message: "User authenticated", tokens });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email and password").message });
    }

    let role, user;

    user = await models.getStaff(email);
    if (user) {
      role = "staff";
    } else {
      user = await models.getAdmin(email);
      if (user) {
        role = "admin";
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED().code)
          .json({ error: httpStatus.UNAUTHORIZED("User not found").message });
      }
    }

    console.log(`role: ${role}`);

    const passwordMatches = compareSync(password, user.password);

    if (!passwordMatches) {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("Invalid password").message });
    }

    const tokens = generateToken(email, role);
    setCookie(res, tokens.accessToken, tokens.refreshToken, email, role);

    req.role = role;
    req.email = email;

    return res
      .status(httpStatus.OK().code)
      .json({ message: "User authenticated", tokens });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

const logout = async (req, res) => {
  try {
    console.log(`${req.email} logged out with role ${req.role}`);

    if (req.role === "patient") {
      await models.deletePatientToken(req.email);
    } else if (req.role === "staff") {
      await models.deleteStaffToken(req.email);
    } else if (req.role === "admin") {
      await models.deleteAdminToken(req.email);
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("User not found").message });
    }

    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res
      .status(httpStatus.OK().code)
      .json({ message: `User ${req.email} logged out` });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

module.exports = {
  registerPatient,
  registerStaff,
  login,
  loginStaff,
  logout,
};
