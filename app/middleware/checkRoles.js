const { model } = require("../models");
const httpStatus = require("../utils/httpStatus");

const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const {email, role} = req.body;

      if (allowedRoles.includes(role)) {
        let user;
        if (role === "patient") {
          user = await model.getPatient(email);
        } else if (role === "staff" || role === "admin") {
          user = await model.getStaff(email);
        }
        
        if (user) {
          return next();
        }
      }
      res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("Forbidden: You do not have the required permissions!").message });
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR("An error occurred while checking permissions").message });
    }
  };
};

module.exports = checkRoles;
