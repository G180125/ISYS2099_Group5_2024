const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());


const { db, model } = require("../models");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const { generateToken, setCookie, introspect } = require("../utils");

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
        .status(409)
        .json({ error: "Email already exists", email: email });
    }

    if (!email || !role) {
      return res
        .status(400)
        .json({ error: "Please enter a email and role" });
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

    return res.status(200).json({
      message: `User ${role} created with email: ${email}`,
      email: email,
      role: role,
    });
  } catch (err) {
    console.error("error: " + err.stack);
    return res
      .status(500)
      .json({ error: "Error inserting user into database" });
  }
};

module.exports = {
  register,
  login,
  loginAdmin,
  logout,
};