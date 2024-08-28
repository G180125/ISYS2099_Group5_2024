
const setCookie = (res, accessToken) => {
  console.log("\n");
  console.log("access token: ", accessToken);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: true, // later in production
    samesite: "strict",
    expires: new Date(Date.now() + oneDay),
  });

  console.log("\n");
  console.log("response accessToken cookie");
};

module.exports = setCookie;