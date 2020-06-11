const fs = require("fs");
const minio = require("minio");

const { FileNotFoundError } = require("./errors");

const host = process.env.MINIO_HOST || "10.0.0.2";
const port = process.env.MINIO_PORT || 9000;
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";
const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
const bucketName = process.env.MINIO_BUCKET || "tarpaulin";

const bucketExists = false;

const minioClient = new minio.Client({
  endPoint: host,
  port,
  useSSL: false,
  secretKey,
  accessKey
});

const checkBucket = async bucket => {
  if (bucketExists) return;
  await minioClient.makeBucket(bucket, "us-west-1");
  bucketExists = true;
};

/**
 *
 * @param {string} filename
 * @returns {Promise<stream.Readable}
 */
const getFile = async filename => {
  await checkBucket(bucketName);
  return minioClient.presignedGetObject(bucketName, filename);
};

/**
 *
 * @param {string} filePath the path on disk to the file to upload
 * @param {string} fileName the name to give the uploaded file
 * @param {string} fileType the MIME type of the file, such as `image/jpeg`
 * @returns {string} the path to access the file later
 * @throws {FileNotFoundError} when there is no file at the path in `filename`
 */
const uploadFile = async (filePath, fileName, fileType) => {
  await checkBucket(bucketName);

  const fileExists = fs.existsSync(filePath);

  if (!fileExists) {
    throw new FileNotFoundError();
  }

  const metadata = {
    "Content-Type": fileType
  };

  await minioClient.fPutObject(bucketName, fileName, filePath, metadata);

  return fileName;
};

module.exports = { getFile, uploadFile };
