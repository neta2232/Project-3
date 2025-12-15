import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "node:stream";
import { appConfig } from "../utils/config";

function getS3Client() {
    const accessKeyId = appConfig.s3_config.key;
    const secretAccessKey = appConfig.s3_config.secret;
    const region = appConfig.s3_config.region;
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        },
    })
    return s3Client;
}

export async function uploadToS3Readable(fileStream: Readable, fileName: string): Promise<void> {
    const client = getS3Client();
    const upload = new Upload({
        client,
        params: {
            Bucket: appConfig.s3_config.bucket_name,
            Key: appConfig.s3_config.folder + "/" + fileName,
            Body: fileStream
        }
    });

    try {
        await upload.done();
        console.log("Readable file successfully uploaded");
    } catch (error) {
        console.log("ERROR Readable file not uploaded", error);
    }
}

export async function deleteFromS3(objectName: string) {
    const s3Client = getS3Client()
    const bucket = appConfig.s3_config.bucket_name;

    const deleteParams = {
        Bucket: bucket,
        Key: appConfig.s3_config.folder + "/" + objectName
    }
    try {
        const command = new DeleteObjectCommand(deleteParams);
        const res = await s3Client.send(command);
        console.log(`Object ${objectName} successfully deleted from S3 ${bucket} `);
    } catch (error) {
        console.log("Error during deleting from S3: ", error);
    }
}