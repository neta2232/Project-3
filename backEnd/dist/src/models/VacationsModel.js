"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationsModel = void 0;
const joi_1 = __importDefault(require("joi"));
class VacationsModel {
    constructor(id, destination, description, start_date, end_date, price, image_fileName, followers, isuserFollow) {
        this.id = id;
        this.destination = destination;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.price = price;
        this.image_fileName = image_fileName;
        this.followers = followers;
        this.isuserFollow = isuserFollow;
    }
    validate() {
        const res = VacationsModel.validationSchema.validate(this);
        if (res.error) {
            throw new Error(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`);
        }
    }
}
exports.VacationsModel = VacationsModel;
VacationsModel.validationSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    destination: joi_1.default.string().required().min(3).max(40),
    description: joi_1.default.string().required().min(10).max(350),
    start_date: joi_1.default.date().required(),
    end_date: joi_1.default.date().required(),
    price: joi_1.default.number().positive().required(),
    image_fileName: joi_1.default.optional(),
    followers: joi_1.default.optional(),
    isuserFollow: joi_1.default.optional()
});
