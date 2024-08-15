const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const { db, model } = require("../models");
const { hashSync, genSaltSync } = require("bcrypt");
const { generateToken, setCookie, introspect } = require("../utils");
const httpStatus = require("../utils/httpStatus"); 

// Endpoint for /register
const register = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    console.log("\n");
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    console.log(`role: ${role}`);

    if (
      (await model.getPatientByEmail(email)) ||
      (await model.getStaffByEmail(email))
    ) {
      return res
        .status(httpStatus.CONFLICT().code)
        .json({ error: httpStatus.CONFLICT(`Email ${email} already exists`).message });
    }

    if (!email || !role) {
      return res
        .status(httpStatus.BAD_REQUEST().code)
        .json({ error: httpStatus.BAD_REQUEST("Please enter an email and role").message });
    }

    // Hash the password
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    console.log("\n");
    console.log(`Hashed Password: ${hashedPassword}`);

    // Insert the user into the database
    model.insertLazadaUserByRole(role, email, hashedPassword);

    req.role = role;
    req.email = email;

    return res.status(httpStatus.OK.code).json({
      message: `User ${role} created with email: ${email}`,
      email: email,
      role: role,
    });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR().code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR("Error inserting user into database").message });
  }
};

module.exports = {
  register,
  login,
  loginAdmin,
  logout,
};
