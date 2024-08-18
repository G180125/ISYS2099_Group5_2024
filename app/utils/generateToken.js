/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const db = require("../models/db.js");

const generateToken = (email, role) => {
  try {
    // Check if environment variables are set
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        "Token secrets are not set in the environment variables.",
      );
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { email: email, role: role},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { email: email, role: role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    console.log("\n");
    console.log(`User for tokens: ${email}`);

    // Store the refresh token in the database
    if (role === "admin") {
      db.poolAdmin.query(
        "UPDATE staff SET refresh_token = ? WHERE email = ? AND job_type = 'A'",
        [refreshToken, email],
      );
      console.log(`admin`);
    } else if (role === "staff"){
      db.poolStaff.query(
        "UPDATE staff SET refresh_token = ? WHERE email = ? AND job_type <> 'A'",
        [refreshToken, email],
      );
    } else {
        db.poolPatient.query(
            "UPDATE patient SET refresh_token = ? WHERE email = ? ",
            [refreshToken, email],
        );
    }

    return { accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = generateToken;