const generateTokens = require("./generateToken");

const setCookie = (res, accessToken, refreshToken, email, role) => {
  console.log("\n");
  console.log("access token: ", accessToken);
  console.log("refresh token: ", refreshToken);

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: true, // later in production
    samesite: "strict",
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // secure: true, // later in production
    samesite: "strict",
    expires: new Date(Date.now() + longerExp),
  });

  res.cookie("email", email, {
    httpOnly: true,
    // secure: true, // later in production
    samesite: "strict",
    expires: new Date(Date.now() + longerExp),
  });

  res.cookie("role", role, {
    httpOnly: true,
    // secure: true, // later in production
    samesite: "strict",
    expires: new Date(Date.now() + longerExp),
  });

  console.log("\n");
  console.log("response accessToken cookie and refreshToken cookie");
};

module.exports = setCookie;