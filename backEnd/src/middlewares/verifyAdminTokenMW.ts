import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/authHelper";

export function verifyTokenAdminMW(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.substring(7);
    const user = verifyToken(token, true);      
    console.log(user);
    res.locals.user = user;
    next();
}