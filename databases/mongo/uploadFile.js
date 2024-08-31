const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const client = require("./client");
const dbName = process.env.MONGO_DB_NAME;

const uploadFile = async (fileTarget, dirTarget, metadata) => {
  try {
    await client.connect();
    const db = client.db(dbName);

    const bucketName =
      dirTarget == "staff"
        ? process.env.MONGO_BUCKET_STAFF
        : process.env.MONGO_BUCKET_TREATMENT;
    const fileName = `${Date.now()}-${fileTarget.originalname}`;

    let bucket = new GridFSBucket(db, {
      bucketName: bucketName,
    });

    const promise = new Promise((resolve, reject) => {
      let upLoadStream = bucket.openUploadStream(fileName, {
        metadata: metadata,
      });

      Readable.from(fileTarget.buffer)
        .pipe(upLoadStream)
        .on("finish", () => {
          resolve(true);
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    return await promise;
  } catch (err) {
    throw err;
  } finally {
    await client.close();
  }
};

module.exports = uploadFile;
