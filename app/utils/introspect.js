const jwt = require("jsonwebtoken");

const introspect = (token, secretKey) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // If verification is successful, the decoded data is returned
    return decoded;
  } catch (err) {
    // If verification fails, an error is thrown
    console.error(err);
    throw err;
  }
};

module.exports = introspect;