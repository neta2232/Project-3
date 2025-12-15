import Joi from "joi";

export class UserModel {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    isadmin: boolean;

    constructor(
        id: number | undefined,
        first_name: string,
        last_name: string,
        email: string,
        password_hash: string,
        isadmin: boolean

    ) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password_hash= password_hash;
        this.isadmin = isadmin;
    }

        private static validationSchema = Joi.object({
        first_name: Joi.string().required().min(3).max(10),
        last_name: Joi.string().required().min(3).max(10),
        email: Joi.string().required(),
        password_hash: Joi.string().required().min(4).max(18),
        isadmin: Joi.boolean().required()
    })

    public validate()  {
        const res = UserModel.validationSchema.validate(this);
        if (res.error){                       
            throw new Error(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`)
        }

    }
}