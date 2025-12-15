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
Object.defineProperty(exports, "__esModule", { value: true });
exports.followVacation = followVacation;
exports.unfollowVacation = unfollowVacation;
const dal_1 = require("../dal/dal");
function followVacation(userid, vacationid) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `INSERT INTO followers (user_id, vacation_id) VALUES ($1, $2) RETURNING id`;
        const res = yield (0, dal_1.runQuery)(q, [userid, vacationid]);
        console.log("DB response:", res);
        return res;
    });
}
function unfollowVacation(userid, vacationid) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `
    DELETE FROM followers
    WHERE user_id=$1 AND vacation_id=$2
  `;
        const res = yield (0, dal_1.runQuery)(q, [userid, vacationid]);
        return res.rowCount;
    });
}
