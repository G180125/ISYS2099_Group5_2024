const express = require("express");
const reportRouter = express.Router();  
const reportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authenticate");
const checkRoles = require("../middleware/checkRoles");

// get patient treatment history for a specific date
reportRouter.get(
  "/test1",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewReportForGivenDuration
);

// get patient treatment history within a date range
reportRouter.get(
  "/test2",
  authenticate, 
  checkRoles(["admin", "staff"]), 
  reportController.viewReportInGivenDuration
);

module.exports = reportRouter;
