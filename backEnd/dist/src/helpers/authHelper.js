"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const exceptions_1 = require("../models/exceptions");
function createToken(user) {
    const userWithoutPassword = Object.assign({}, user);
    delete userWithoutPassword.password_hash;
    console.log(userWithoutPassword);
    console.log(jsonwebtoken_1.default.sign(userWithoutPassword, config_1.appConfig.tokenSecretKey));
    return jsonwebtoken_1.default.sign(userWithoutPassword, config_1.appConfig.tokenSecretKey);
}
function verifyToken(token, adminRequired = false) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.appConfig.tokenSecretKey);
        if (adminRequired && !decoded.isadmin)
            throw new exceptions_1.UnauthorizedError();
        console.log(decoded);
        return decoded;
    }
    catch (_a) {
        throw new exceptions_1.UnauthorizedError();
    }
}
