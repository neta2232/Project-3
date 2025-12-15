import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/authHelper";

export function verifyTokenMW(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send("Missing or invalid Authorization header");
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user?.id) {
      return res.status(401).send("Invalid token payload: missing id");
    }

    res.locals.user = user;
    next();
  } catch {
    return res.status(401).send("Unauthorized");
  }
}

