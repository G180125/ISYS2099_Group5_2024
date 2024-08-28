const model = require("../models/models");
const httpStatus = require("../utils/httpStatus");

const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { email, role } = req;

      console.log(`role: ${role}`);

      if (allowedRoles.includes(role)) {
        let user;
        if (role === "patient") {
          user = await model.getPatient(email);
        } else if (role === "staff") {
          user = await model.getStaff(email);
        } else {
          user = await model.getAdmin(email);
        }

        if (user) {
          console.log("Grant Permission");
          req.email = email;
          req.role = role;
          return next();
        }
      }

      res
        .status(httpStatus.FORBIDDEN().code)
        .json({ error: httpStatus.FORBIDDEN("You do not have the required permissions!").message });
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ error: httpStatus.INTERNAL_SERVER_ERROR.message });
    }
  };
};

module.exports = checkRoles;
