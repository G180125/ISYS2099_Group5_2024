const models = require("../services/mysqlService");
const httpStatus = require("../utils/httpStatus");

// Define role hierarchy
const roleHierarchy = ['admin', 'staff', 'patient'];

const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      // Check if the current role is in the allowed roles
      if (allowedRoles.includes(role)) {
        const user = models.getUserById(id)

        if (user) {
          console.log("Grant Permission");

          // Determine the role to assign based on allowed roles
          let assignedRole;
          if (allowedRoles.length === 1) {
            assignedRole = allowedRoles[0];
          } else {
            // Sort allowedRoles based on roleHierarchy and get the lowest role
            allowedRoles.sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b));
            assignedRole = allowedRoles[0];
          }

          req.id = id;
          req.role = assignedRole; 
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
