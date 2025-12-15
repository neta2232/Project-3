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
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const UserModel_1 = require("../models/UserModel");
const userServices_1 = require("../services/userServices");
const StatusCode_1 = require("../models/StatusCode");
const followersService_1 = require("../services/followersService");
const verifyUserTokenMW_1 = require("../middlewares/verifyUserTokenMW");
exports.userRoutes = express_1.default.Router();
exports.userRoutes.post('/user-register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password_hash, isadmin } = req.body;
    const user = new UserModel_1.UserModel(undefined, first_name, last_name, email, password_hash, false);
    const token = yield (0, userServices_1.createUser)(user);
    res.status(StatusCode_1.StatusCode.Created).json({ token: token });
}));
exports.userRoutes.post('/user-login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, userServices_1.login)(email, password);
    res.status(StatusCode_1.StatusCode.Ok).json(user);
}));
exports.userRoutes.post('/follow-vacation', verifyUserTokenMW_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, vacation_id } = req.body;
    const follow = yield (0, followersService_1.followVacation)(user_id, vacation_id);
    res.status(StatusCode_1.StatusCode.Ok).json(follow);
}));
exports.userRoutes.delete('/unfollow-vacation', verifyUserTokenMW_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, vacation_id } = req.body;
    const unfollow = yield (0, followersService_1.unfollowVacation)(user_id, vacation_id);
    res.status(StatusCode_1.StatusCode.Ok).json(unfollow);
}));
