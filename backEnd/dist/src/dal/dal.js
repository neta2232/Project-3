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
exports.getDbClient = getDbClient;
exports.runQuery = runQuery;
const config_1 = require("../utils/config");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: config_1.appConfig.DB_URL, ssl: { rejectUnauthorized: false } });
function getDbClient() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool.connect();
    });
}
function runQuery(q_1) {
    return __awaiter(this, arguments, void 0, function* (q, params = [], client = undefined) {
        const executor = client || pool;
        const res = yield executor.query(q, params);
        if (res.rows && res.rows.length > 0) {
            return res.rows;
        }
        return { changes: res.rowCount };
    });
}
