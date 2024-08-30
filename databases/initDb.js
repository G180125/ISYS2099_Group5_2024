const setupMongo = require("./mongo/_setup");
const setupMysql = require("./mysql/_setup");


(async () => {
  console.log('> Init MySQL . . .');
  await setupMysql();
  
  console.log('\n> Init Mongo . . .');
  await setupMongo();
  
})().then();