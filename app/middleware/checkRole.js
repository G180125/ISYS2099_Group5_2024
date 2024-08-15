require("express");
const { model } = require("../models");

const checkPatient = async (req, res, next) => {
  try {
    const email = req.email;
    const role = req.role;

    // Check if the user is a buyer by querying the buyer table
    if ((await model.getPatient(email)) && role === "patient") {
      // If the user is a buyer, call the next middleware function
      next();
    } else {
      // If the user is not a buyer, return an error response
      res.status(403).json({ message: `Forbidden: You are not patient!` });
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

    // Check if the user is a seller by querying the seller table
    if ((await model.getStaff(email)) && role === "staff") {
      // If the user is a seller, call the next middleware function
      next();
    } else {
      // If the user is not a seller, return an error response
      res.status(403).json({ message: `Forbidden: You are not staff member!` });
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