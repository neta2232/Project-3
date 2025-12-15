"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMW = verifyTokenMW;
const authHelper_1 = require("../helpers/authHelper");
function verifyTokenMW(req, res, next) {
    try {
        const authHeader = req.header("Authorization");
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            return res.status(401).send("Missing or invalid Authorization header");
        }
        const token = authHeader.substring(7);
        const user = (0, authHelper_1.verifyToken)(token);
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            return res.status(401).send("Invalid token payload: missing id");
        }
        res.locals.user = user;
        next();
    }
    catch (_a) {
        return res.status(401).send("Unauthorized");
    }
}
