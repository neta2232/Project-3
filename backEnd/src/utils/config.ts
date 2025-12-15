import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const IMAGE_FILE = path.resolve(__dirname, "..", "images");

class BaseConfig {
  tokenSecretKey: string | undefined = process.env.TOKEN_SECRET_KEY;
  pepper = process.env.HASH_PEPPER;

    DB_USER = process.env.DB_USER;
    DB_PASSWORD =process.env.DB_PASSWORD;
    DB_HOST = process.env.DB_HOST;
    DB_PORT = process.env.DB_PORT;
    DB_NAME = process.env.DB_NAME;

    readonly s3_config = {
      key: process.env.S3_KEY,
      secret: process.env.S3_SECRET,
      region: "eu-central-1",
      bucket_name:"netasbucket",
      folder: "vacation_images",
      objectsPrefix: "https://netasbucket.s3.eu-central-1.amazonaws.com/vacation_images/"
    }
    DB_URL = `postgres://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`

}

class DevConfig extends BaseConfig {
  port: number = 3030;
}

class ProdConfig extends BaseConfig {
  port: number = 3033;
}

export const appConfig =
  Number(process.env.IS_PROD) === 1 ? new ProdConfig() : new DevConfig();
  




        
    




