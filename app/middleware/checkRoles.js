const model = require("../services/mysqlService");
const httpStatus = require("../utils/httpStatus");

const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      console.log(`role: ${role}`);

      if (allowedRoles.includes(role)) {
        let user;
        if (role === "patient") {
          user = await model.getPatientByID(id);
        } else if (role === "staff") {
          user = await model.getStaffByID(id);
        } else {
          user = await model.getAdminByID(id);
        }

        if (user) {
          console.log("Grant Permission");
          req.id = id;
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
