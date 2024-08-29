const httpStatus = require("../utils/httpStatus");

const errorHandler = (err, req, res, next) => {
    console.dir(err);
    
    return res
        .status(err.status || httpStatus.INTERNAL_SERVER_ERROR.code)
        .json({
            message: "Internal Server Error",
            error: err.message,
        });
};
    
module.exports = {
    errorHandler
};