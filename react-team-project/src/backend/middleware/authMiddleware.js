// const jwt = require("jsonwebtoken");

// Pls leav it like this.
// It doesn't change anything in the code.
// We just need to use ES module syntax because our project uses Vite and "type": "module"
import jwt from "jsonwebtoken";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      message: "Server configuration error.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

export default requireAuth;

// module.exports = requireAuth;
