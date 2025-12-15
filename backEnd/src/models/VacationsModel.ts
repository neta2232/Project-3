import { UploadedFile } from "express-fileupload";
import Joi from "joi";

export class VacationsModel {
    id?: number;
    destination: string;
    description: string;
    start_date: Date;
    end_date: Date;
    price: number;
    image_fileName: UploadedFile;
    followers: number;
    isuserFollow: boolean

    constructor(
        id: number | undefined,
        destination: string,
        description: string,
        start_date: Date,
        end_date: Date,
        price: number,
        image_fileName: UploadedFile,
        followers: number,
        isuserFollow: boolean

    ) {
        this.id = id;
        this.destination = destination;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.price = price;
        this.image_fileName = image_fileName;
        this.followers = followers;
        this.isuserFollow = isuserFollow
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional(),
        destination: Joi.string().required().min(3).max(40),
        description: Joi.string().required().min(10).max(350),
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        price: Joi.number().positive().required(),
        image_fileName: Joi.optional(),
        followers: Joi.optional(),
        isuserFollow: Joi.optional()
    })

    public validate() {
        const res = VacationsModel.validationSchema.validate(this);
        if (res.error) {
            throw new Error(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`)
        }

    }
}
