import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { appConfig } from "../utils/config";
import { UnauthorizedError } from "../models/exceptions";


export function createToken(user: Partial<UserModel>): string {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password_hash;
    return jwt.sign(userWithoutPassword, appConfig.tokenSecretKey);
}

export function verifyToken(token: string | undefined, adminRequired = false) {
    try {
        const decoded = jwt.verify(token, appConfig.tokenSecretKey) as UserModel;
        if (adminRequired && !decoded.isadmin) throw new UnauthorizedError();
        return decoded;
    } catch {
        throw new UnauthorizedError();
    }
}


