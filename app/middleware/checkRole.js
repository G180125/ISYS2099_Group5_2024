require("express");
const { model } = require("../models");
const httpStatus = require("../utils/httpStatus");

const checkPatient = async (req, res, next) => {
  try {
    const email = req.email;
    const role = req.role;

    if ((await model.getPatient(email)) && role === "patient") {
      next();
    } else {
      res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Forbidden: You are not patient!").message });
    }
  } catch (error) {
    // Handle errors
    next(error);
  }
};

const checkStaff = async (req, res, next) => {
  try {
    const email = req.email;
    const role = req.role;

    if ((await model.getStaff(email)) && role === "staff") {
      next();
    } else {
      res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Forbidden: You are not staff member!").message });
    }
  } catch (error) {
    // Handle errors
    next(error);
  }
};

module.exports = {
  checkPatient,
  checkStaff,
};