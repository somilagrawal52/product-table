const { validatetoken } = require("../services/auth");

function checkforauthentication(_cookieName) {
  return (req, res, next) => {
    const tokencookievalue = req.cookies[_cookieName];
    if (!tokencookievalue) {
      return next();
    }

    try {
      const userpayload = validatetoken(tokencookievalue);
      req.user = userpayload;
    } catch (error) {
      console.error("Token validation Error:", error);
    }
    return next();
  };
}

module.exports = {
  checkforauthentication,
};
