const express = require("express");
const cookieParser = require("cookie-parser");
const { db, model } = require("../models");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { generateToken, setCookie } = require("../utils");
const httpStatus = require("../utils/httpStatus");

const app = express();
app.use(cookieParser());

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !role || !password) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please provide email, password, and role").message });
    }

    if (
      await model.getPatient(email) ||
      await model.getStaff(email) ||
      await model.getAdmin(email)
    ) {
      return res
        .status(httpStatus.CONFLICT().code)
        .json({ error: httpStatus.CONFLICT(`Email ${email} already exists`).message });
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    if (role === "patient") {
      await model.insertPatient(email, hashedPassword);
    } else if (role === "staff") {
      await model.insertStaff(email, hashedPassword);
    } else if (role === "admin") {
      await model.insertAdmin(email, hashedPassword);
    } else {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Invalid role provided").message });
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

    user = await model.getPatient(email);
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
    setCookie(res, email, role);

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

    user = await model.getStaff(email);
    if (user) {
      role = "staff";
    } else {
      user = await model.getAdmin(email);
      if (user) {
        role = "admin";
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED().code)
          .json({ error: httpStatus.UNAUTHORIZED("User not found").message });
      }
    }

    const passwordMatches = compareSync(password, user.password);

    if (!passwordMatches) {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("Invalid password").message });
    }

    const tokens = generateToken(email, role);
    setCookie(res, email, role);

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
      await model.deletePatientToken(req.email);
    } else if (req.role === "staff") {
      await model.deleteStaffToken(req.email);
    } else if (req.role === "admin") {
      await model.deleteAdminToken(req.email);
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
  register,
  login,
  loginStaff,
  logout,
};
