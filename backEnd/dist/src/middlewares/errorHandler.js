"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const exceptions_1 = require("../models/exceptions");
const StatusCode_1 = require("../models/StatusCode");
function errorHandler(error, request, response, next) {
    if (error instanceof exceptions_1.AppException) {
        response.status(error.status).send(error.message);
        return;
    }
    const msg = `Unknown error. message: ${error.message}.\nTB:\n${error.stack}`;
    response.status(StatusCode_1.StatusCode.ServerError).send("Internal Server Error" + error.message + error.stack);
}
