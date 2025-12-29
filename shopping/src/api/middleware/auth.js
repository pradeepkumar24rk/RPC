const { ValidateToken } = require("../../utils");

module.exports = async (req, res, next) => {
  try {
    const isAuthorized = await ValidateToken(req);

    if (isAuthorized) {
      return next();
    }
  } catch (err) {
    console.log(err.message);
    if (err.name === "JsonWebTokenError") {
      throw new ForbiddenError("Invalid token signature");
    }
    throw new ForbiddenError("Authentication Failure");
  }
};
