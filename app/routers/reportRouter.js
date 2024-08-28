const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// Route to get patient treatment history for a specific date
reportRouter.get(
  "",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewReportForGivenDuration
);

// Route to get patient treatment history within a date range
reportRouter.get(
  "/reports/range",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewReportInGivenDuration
);

module.exports = reportRouter;
