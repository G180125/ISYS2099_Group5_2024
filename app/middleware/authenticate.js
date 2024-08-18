/* eslint-disable no-undef */
const { setCookie, introspect } = require("../utils");
const { getUserByRole } = require("../models/models");
const httpStatus = require("../utils/httpStatus");

const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken , email, role} = req.cookies;

  console.log("\n");
  console.log("Access token: " + accessToken);
  console.log("Refresh token: " + refreshToken);

  try {
    // Check if refresh token exists
    if (!refreshToken) {
      return res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Authentication Invalid").message });
    }

    // Verify refresh token
    const payload = introspect(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!payload) {
      return res
        .status(httpStatus.UNAUTHORIZED().code)
        .json({ error: httpStatus.UNAUTHORIZED("Invalid token").message });
    }

    console.log("\n");
    console.log(`email with the token ${payload.email}`);

    // Get user by role
    const user = await getUserByRole(payload.role, payload.email);

    if (!user || !user.refresh_token) {
      return res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Authentication Invalid").message });
    }

    console.log("\n");
    console.log(`Auth user ${user.email} refresh token ${user.refresh_token}`);
    
    // Set new token cookies
    setCookie(res, accessToken, refreshToken, email, role);

    // Attach user information to the request
    req.email = payload.email;
    req.role = payload.role;

    next();
  } catch (err) {
    console.error(err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

module.exports = {
  authenticate,
};
