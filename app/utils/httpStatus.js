const httpStatus = {
    OK: (message, data) => ({ code: 200, message: message, data}),
    CREATED: (data) => ({ code: 201, message: "Created", data }),
    BAD_REQUEST: (details) => ({ code: 400, message: `Bad Request: ${details}` }),
    UNAUTHORIZED: (details) => ({ code: 401, message: `Unauthorized: ${details}` }),
    FORBIDDEN: (details) => ({ code: 403, message: `Forbidden: ${details}` }),
    NOT_FOUND: (details) => ({ code: 404, message: `Not Found: ${details}` }),
    CONFLICT: (details) => ({ code: 409, message: `Conflict: ${details}` }),
    INTERNAL_SERVER_ERROR: { code: 500, message: `Internal Server Error`},
  };
  
module.exports = httpStatus;
  