"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAdminMW = verifyTokenAdminMW;
const authHelper_1 = require("../helpers/authHelper");
function verifyTokenAdminMW(req, res, next) {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.substring(7);
    const user = (0, authHelper_1.verifyToken)(token, true);
    console.log(user);
    res.locals.user = user;
    next();
}
