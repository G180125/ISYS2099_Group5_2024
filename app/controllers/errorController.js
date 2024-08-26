const httpStatus = require("../utils/httpStatus");

const errorHandler = (err, req, res, next) => {
    return res
        .status(err.status || httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({
            message: "Internal Server Error",
            error: err,
        });
};
    
module.exports = {
    errorHandler
};