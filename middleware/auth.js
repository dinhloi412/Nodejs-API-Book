const jwt = require("jsonwebtoken");
const middleware = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        next();
      } else {
        return res.status(401).json("You're not authenticated");
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verifyTokenAndUserAuthorization: (req, res, next) => {
    middleware.verifyToken(req, res, next),
      () => {
        if (req.user.id === req.params.id || req.user.admin) {
          next();
        } else {
          res.status(500).json("you are not allow");
        }
      };
  },
};

module.exports = middleware;
