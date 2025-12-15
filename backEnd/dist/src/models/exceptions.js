"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.UnauthorizedError = exports.UnknownError = exports.ValidationError = exports.AppException = void 0;
const StatusCode_1 = require("./StatusCode");
class AppException {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}
exports.AppException = AppException;
class ValidationError extends AppException {
    constructor(message) {
        super(StatusCode_1.StatusCode.BadRequest, message);
    }
}
exports.ValidationError = ValidationError;
class UnknownError extends AppException {
    constructor(optionalMsg) {
        const msg = optionalMsg ? optionalMsg : "internal sever error!";
        super(StatusCode_1.StatusCode.ServerError, msg);
    }
}
exports.UnknownError = UnknownError;
class UnauthorizedError extends AppException {
    constructor(message) {
        super(StatusCode_1.StatusCode.Unauthorized, message ? message : "unauthorized");
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends AppException {
    constructor(message) {
        super(StatusCode_1.StatusCode.NotFound, message);
    }
}
exports.NotFoundError = NotFoundError;
