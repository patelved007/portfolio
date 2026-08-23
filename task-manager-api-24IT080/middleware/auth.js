const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access denied. Authorization header with Bearer token is missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. Token is missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token.",
      details: err.message,
    });
  }
};
