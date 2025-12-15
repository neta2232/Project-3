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
exports.vacationsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vacationsService_1 = require("../services/vacationsService");
const VacationsModel_1 = require("../models/VacationsModel");
const verifyUserTokenMW_1 = require("../middlewares/verifyUserTokenMW");
const verifyAdminTokenMW_1 = require("../middlewares/verifyAdminTokenMW");
const StatusCode_1 = require("../models/StatusCode");
exports.vacationsRoutes = express_1.default.Router();
exports.vacationsRoutes.get('/vacations-paged', verifyUserTokenMW_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        return res.status(401).send("User not authenticated or ID missing.");
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    try {
        const vacations = yield (0, vacationsService_1.getVacationsPaged)(page, limit, user.id, req.query.futureVacations === 'true', req.query.activeVacations === 'true', req.query.followedVacations === 'true');
        res.status(200).json(vacations);
    }
    catch (err) {
        next(err);
    }
}));
exports.vacationsRoutes.get('/user-vacations', verifyUserTokenMW_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const vacations = yield (0, vacationsService_1.getVacationsPaged)(page || 1, limit || 10);
    res.status(StatusCode_1.StatusCode.Ok).json(vacations);
}));
exports.vacationsRoutes.post('/add-vacation', verifyAdminTokenMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uploadedFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image_fileName;
    const newVacation = new VacationsModel_1.VacationsModel(undefined, req.body.destination, req.body.description, new Date(req.body.start_date), new Date(req.body.end_date), +req.body.price, uploadedFile, req.body.followers || 0, req.body.is_following || false);
    newVacation.validate();
    const newId = yield (0, vacationsService_1.addVacation)(newVacation);
    res.status(StatusCode_1.StatusCode.Created).send(newId);
}));
exports.vacationsRoutes.patch('/update-vacation', verifyAdminTokenMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const imageFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image_fileName;
        const VacationUpdated = new VacationsModel_1.VacationsModel(req.body.id, req.body.destination, req.body.description, req.body.start_date, req.body.end_date, req.body.price, imageFile || req.body.image_fileName, req.body.followers, req.body.isuserFollow ? req.body.isuserFollow : undefined);
        VacationUpdated.validate();
        const update = yield (0, vacationsService_1.updateVacation)(VacationUpdated);
        res.status(StatusCode_1.StatusCode.Ok).send(update);
    }
    catch (err) {
        next(err);
    }
}));
exports.vacationsRoutes.delete('/delete-vacation', verifyAdminTokenMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vacationId = req.body.vacationId;
    const changes = yield (0, vacationsService_1.deleteVacation)(vacationId);
    res.status(StatusCode_1.StatusCode.Ok).send(changes);
}));
exports.vacationsRoutes.get('/vacations-followers', verifyAdminTokenMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vacation_followers = yield (0, vacationsService_1.getVacationFollowers)();
    res.status(StatusCode_1.StatusCode.Ok).send(vacation_followers);
}));
