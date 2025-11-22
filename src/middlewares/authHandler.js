import jwt from "jsonwebtoken";

import { sendError } from "./responseHandler.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    sendError(res, "Access denied", 401);
  }

  try {
    const secretKey = process.env.JWT_ACCESS_KEY;

    const decoded = jwt.verify(token, secretKey);

    req.currentUser = decoded;
    next();
  } catch (err) {
    sendError(res, "Invalid or expired token", 403);
  }
};

export default authenticateToken;
