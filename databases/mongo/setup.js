require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const mockData = require("./mockData");
const client = require("./client");

const buckets = [
  // process.env.MONGO_BUCKET_PATIENT,
  process.env.MONGO_BUCKET_STAFF,
  process.env.MONGO_BUCKET_TREATMENT,
];
const dbName = process.env.MONGO_DB_NAME;

console.log("Connecting Mongo ...");
(async () => {
  try {
    await client.connect();
    console.log("Mongo Connected!");
    console.log("Mongo Init Success!");

    console.log("Init database ...");
    const db = client.db(dbName);
    await db.dropDatabase();

    for (bucket of buckets) {
      console.log(`> ${bucket}`);
      await db.createCollection(`${bucket}.chunks`);
      await db.createCollection(`${bucket}.files`);
    }

    console.log("Init mock data...");
    await mockData();
  } finally {
    console.log("Closing connection...");
    await client.close();
  }
})().catch(console.dir);
