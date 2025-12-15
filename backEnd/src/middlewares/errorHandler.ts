import { NextFunction, Request, Response } from "express";
import { AppException } from "../models/exceptions";
import { StatusCode } from "../models/StatusCode";

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction) {

    if (error instanceof AppException) {
        response.status(error.status).send(error.message);
        return;
    }

    const msg = `Unknown error. message: ${error.message}.\nTB:\n${error.stack}`

    response.status(StatusCode.ServerError).send("Internal Server Error" + error.message + error.stack)
}