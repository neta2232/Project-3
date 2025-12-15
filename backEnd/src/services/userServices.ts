import { runQuery } from "../dal/dal";
import { createToken } from "../helpers/authHelper";
import { UnauthorizedError } from "../models/exceptions";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcrypt"
import { appConfig } from "../utils/config";

export async function createUser(user: Partial<UserModel>): Promise<string> {
  const pepper = appConfig.pepper;
  const hash = await bcrypt.hash(user.password_hash + pepper, 12);

  const q = `
    INSERT INTO new_user (first_name, last_name, email, password_hash, isadmin)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
  const values = [user.first_name, user.last_name, user.email, hash, user.isadmin ?? false];
  const res = await runQuery(q, values);

  const newId = res[0]?.id;
  if (!newId) throw new Error("Could not retrieve new user ID");

  const token = createToken({
    id: newId,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    isadmin: user.isadmin ?? false
  });

  return token;
}

export async function login(email: string, password: string): Promise<any> {
  const q = `SELECT * FROM new_user WHERE email=$1`;
  const res = await runQuery(q, [email]) as UserModel[];
  console.log(res);

  if (res.length !== 1) {
    throw new UnauthorizedError("no results from query");
  }

  const user = res[0];
  const pepper = appConfig.pepper;
  const match = await bcrypt.compare(password + pepper, user.password_hash);

  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = createToken(user);
  return token;
}







