/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const db = require("../databases/mysqlClient");

const generateToken = (id, role) => {
  try {
    // Check if environment variables are set
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        "Token secrets are not set in the environment variables.",
      );
    }

    // Generate an access token
    const accessToken = jwt.sign(
      { id: id, role: role},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    console.log("\n");
    console.log(`User for tokens: ${id}`);

    // Store the refresh token in the database
    db.poolPatient.query(
      "UPDATE user SET access_token = ? WHERE user_id = ? ",
      [accessToken, id],
  );

    return { accessToken };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = generateToken;