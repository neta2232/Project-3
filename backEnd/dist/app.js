"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./src/utils/config");
const vacationsControllers_1 = require("./src/controllers/vacationsControllers");
const userController_1 = require("./src/controllers/userController");
const errorHandler_1 = require("./src/middlewares/errorHandler");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)({ origin: ["http://localhost:5173", "http://63.178.226.68"] }));
server.use(express_1.default.json());
server.use((0, express_fileupload_1.default)());
server.use(vacationsControllers_1.vacationsRoutes);
server.use(userController_1.userRoutes);
server.use(errorHandler_1.errorHandler);
server.listen(config_1.appConfig.port, () => {
    console.log(`Express server started on http://localhost:${config_1.appConfig.port}`);
    console.log("Connecting to DB");
});
