const jwt = require("jsonwebtoken");
const publicRoutes = ["/api/auth/login", "/api/auth/signup", "/" ,
  "/api/services"
];

const authenticateJWT = (req, res, next) => {
  // Check if the request path is in the public routes array
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Get token from cookies
  const token = req.cookies?.Authorization ;

  if (!token) {
    return res.status(401).send("Unauthenticated");
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    next();
  });
};

module.exports = authenticateJWT;
