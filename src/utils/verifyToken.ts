import * as jwt from "jsonwebtoken";
import express from "express";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "access token required" });

    const token = authHeader.split("")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: err.message });
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: "invalid credentials" });
  }
};
