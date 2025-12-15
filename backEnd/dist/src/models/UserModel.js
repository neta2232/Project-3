"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const joi_1 = __importDefault(require("joi"));
class UserModel {
    constructor(id, first_name, last_name, email, password_hash, isadmin) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password_hash = password_hash;
        this.isadmin = isadmin;
    }
    validate() {
        const res = UserModel.validationSchema.validate(this);
        if (res.error) {
            throw new Error(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`);
        }
    }
}
exports.UserModel = UserModel;
UserModel.validationSchema = joi_1.default.object({
    first_name: joi_1.default.string().required().min(3).max(10),
    last_name: joi_1.default.string().required().min(3).max(10),
    email: joi_1.default.string().required(),
    password_hash: joi_1.default.string().required().min(4).max(18),
    isadmin: joi_1.default.boolean().required()
});
