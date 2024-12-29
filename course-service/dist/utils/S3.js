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
exports.getObjectUrl = exports.getUploadSignedUrl = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@envy-core/common");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    },
});
const getUploadSignedUrl = (key, contentType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(exports.s3Client, command, {
            expiresIn: parseInt(process.env.AWS_S3_EXPIRY_TIME || "0", 10),
        });
        common_1.logger.info("Generated presigned URL for upload");
        return signedUrl;
    }
    catch (error) {
        common_1.logger.error("Error generating presigned URL for upload", { error });
        return null;
    }
});
exports.getUploadSignedUrl = getUploadSignedUrl;
const getObjectUrl = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        });
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(exports.s3Client, command, { expiresIn: 3600 });
        common_1.logger.info("Generated presigned URL for retrieval");
        return url;
    }
    catch (error) {
        common_1.logger.error("Error generating presigned URL for retrieval", { error });
        return null;
    }
});
exports.getObjectUrl = getObjectUrl;
