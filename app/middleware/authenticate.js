/* eslint-disable no-undef */
const { setTokenCookie, verifyToken } = require("../utils");
const { model } = require("../models");
const httpStatus = require("../utils/httpStatus");

const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  console.log("\n");
  console.log("Access token: " + accessToken);
  console.log("Refresh token: " + refreshToken);

  try {
    // Check if there are any tokens in the cookies
    if (!refreshToken) {
      res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Authentication Ivalid").message });
    } else {
      const payload = verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      console.log("\n");
      console.log(`email with the token ${payload.username}`);

    //   const lazada_user = await model.getLazadaUser(payload.username);
    //   const wh_admin = await model.getWHAdmin(payload.username);
    //   const user = wh_admin ? wh_admin : lazada_user;

      console.log("\n");
      console.log(
        `Auth user ${user.username} refresh token ${user.refresh_token} `,
      );

      if (!user.refresh_token) {
        throw new Error("Authentication Invalid");
      }

      setCookie(res, user.email, payload.role);

      req.email = payload.email;
      req.role = payload.role;

      next();
    }
  } catch (err) {
    console.error(err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR().code)
      .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};

module.exports = {
  authenticate,
};