const { GridFSBucket } = require("mongodb");
const mongoClient = require("../databases/mongoClient");
const { Readable } = require("stream");

const dbName = process.env.MONGO_DB_NAME;

const mongoService = {
  uploadFile: async (file, dirTarget, metadata) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db(dbName);

      const bucketName =
        dirTarget == "staff"
          ? process.env.MONGO_BUCKET_STAFF
          : process.env.MONGO_BUCKET_TREATMENT;
      const fileName = `${Date.now()}-${file.originalname}`;
    //   const metadata = {
    //     mysql_id: "sql id",
    //     type: "my type",
    //   };

      let bucket = new GridFSBucket(db, {
        bucketName: bucketName,
      });

      const promise = new Promise((resolve, reject) => {
        let upLoadStream = bucket.openUploadStream(fileName, {
          metadata: metadata,
        });

        Readable.from(file.buffer)
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
      await mongoClient.close();
    }
  },

  getFileMeta: async (filters, dirTarget) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db(dbName);

      const bucketName =
        dirTarget == "staff"
          ? process.env.MONGO_BUCKET_STAFF
          : process.env.MONGO_BUCKET_TREATMENT;

      let bucket = new GridFSBucket(db, {
        bucketName: bucketName,
      });

      const cursor = bucket.find(filters);
      return await cursor.toArray();
    } catch (err) {
      throw err;
    } finally {
      await mongoClient.close();
    }
  },

  getOneFile: async (fileTarget, dirTarget) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db(dbName);
      const bucketName =
        dirTarget == "staff"
          ? process.env.MONGO_BUCKET_STAFF
          : process.env.MONGO_BUCKET_TREATMENT;

      let bucket = new GridFSBucket(db, {
        bucketName: bucketName,
      });

      const promise = new Promise((resolve, reject) => {
        const _buffer = [];
        bucket
          .openDownloadStreamByName(fileTarget)
          .on("data", (chunk) => {
            _buffer.push(chunk);
          })
          .on("end", () => {
            // const file = Buffer.concat(_buffer);
            // console.log("File Downloaded!");
            resolve(Buffer.concat(_buffer));
          })
          .on("error", (err) => {
            reject(err);
          });
      });

      return await promise;
    } catch (err) {
      throw err;
    } finally {
      await mongoClient.close();
    }
  },
};

module.exports = mongoService;
