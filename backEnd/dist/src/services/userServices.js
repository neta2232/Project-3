"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.login = login;
const dal_1 = require("../dal/dal");
const authHelper_1 = require("../helpers/authHelper");
const exceptions_1 = require("../models/exceptions");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../utils/config");
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const pepper = config_1.appConfig.pepper;
        const hash = yield bcrypt_1.default.hash(user.password_hash + pepper, 12);
        const q = `
    INSERT INTO new_user (first_name, last_name, email, password_hash, isadmin)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
        const values = [user.first_name, user.last_name, user.email, hash, (_a = user.isadmin) !== null && _a !== void 0 ? _a : false];
        const res = yield (0, dal_1.runQuery)(q, values);
        const newId = (_b = res[0]) === null || _b === void 0 ? void 0 : _b.id;
        if (!newId)
            throw new Error("Could not retrieve new user ID");
        const token = (0, authHelper_1.createToken)({
            id: newId,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            isadmin: (_c = user.isadmin) !== null && _c !== void 0 ? _c : false
        });
        return token;
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT * FROM new_user WHERE email=$1`;
        const res = yield (0, dal_1.runQuery)(q, [email]);
        console.log(res);
        if (res.length !== 1) {
            throw new exceptions_1.UnauthorizedError("no results from query");
        }
        const user = res[0];
        const pepper = config_1.appConfig.pepper;
        const match = yield bcrypt_1.default.compare(password + pepper, user.password_hash);
        if (!match) {
            throw new exceptions_1.UnauthorizedError("Invalid email or password");
        }
        const token = (0, authHelper_1.createToken)(user);
        return token;
    });
}
