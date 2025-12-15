"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.IMAGE_FILE = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.IMAGE_FILE = path_1.default.resolve(__dirname, "..", "images");
class BaseConfig {
    constructor() {
        this.tokenSecretKey = process.env.TOKEN_SECRET_KEY;
        this.pepper = process.env.HASH_PEPPER;
        this.DB_USER = process.env.DB_USER;
        this.DB_PASSWORD = process.env.DB_PASSWORD;
        this.DB_HOST = process.env.DB_HOST;
        this.DB_PORT = process.env.DB_PORT;
        this.DB_NAME = process.env.DB_NAME;
        this.s3_config = {
            key: process.env.S3_KEY,
            secret: process.env.S3_SECRET,
            region: "eu-central-1",
            bucket_name: "netasbucket",
            folder: "vacation_images",
            objectsPrefix: "https://netasbucket.s3.eu-central-1.amazonaws.com/vacation_images/"
        };
        this.DB_URL = `postgres://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;
    }
}
class DevConfig extends BaseConfig {
    constructor() {
        super(...arguments);
        this.port = 3030;
    }
}
class ProdConfig extends BaseConfig {
    constructor() {
        super(...arguments);
        this.port = 3033;
    }
}
exports.appConfig = Number(process.env.IS_PROD) === 1 ? new ProdConfig() : new DevConfig();
