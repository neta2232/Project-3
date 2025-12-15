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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3Readable = uploadToS3Readable;
exports.deleteFromS3 = deleteFromS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const config_1 = require("../utils/config");
function getS3Client() {
    const accessKeyId = config_1.appConfig.s3_config.key;
    const secretAccessKey = config_1.appConfig.s3_config.secret;
    const region = config_1.appConfig.s3_config.region;
    const s3Client = new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        },
    });
    return s3Client;
}
function uploadToS3Readable(fileStream, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getS3Client();
        const upload = new lib_storage_1.Upload({
            client,
            params: {
                Bucket: config_1.appConfig.s3_config.bucket_name,
                Key: config_1.appConfig.s3_config.folder + "/" + fileName,
                Body: fileStream
            }
        });
        try {
            yield upload.done();
            console.log("Readable file successfully uploaded");
        }
        catch (error) {
            console.log("ERROR Readable file not uploaded", error);
        }
    });
}
function deleteFromS3(objectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const s3Client = getS3Client();
        const bucket = config_1.appConfig.s3_config.bucket_name;
        const deleteParams = {
            Bucket: bucket,
            Key: config_1.appConfig.s3_config.folder + "/" + objectName
        };
        try {
            const command = new client_s3_1.DeleteObjectCommand(deleteParams);
            const res = yield s3Client.send(command);
            console.log(`Object ${objectName} successfully deleted from S3 ${bucket} `);
        }
        catch (error) {
            console.log("Error during deleting from S3: ", error);
        }
    });
}
