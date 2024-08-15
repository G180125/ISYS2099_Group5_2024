/* eslint-disable no-undef */
const mysql = require("mysql2/promise");

class Database {
  constructor() {
    if (Database.exists) {
      return Database.instance;
    }
    this.initDB();
    Database.instance = this;
    Database.exists = true;
    return this;
  }

  initDB() {
    this.poolPatientAppUser = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_APP_USER,
      password: process.env.DB_APP_PASS,
      database: process.env.DB_MYSQL,
      connectionLimit: process.env.DB_CONNECTION_LIMIT,
    });

    this.poolAdminAppUser = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_APP_USER,
      password: process.env.DB_APP_PASS,
      database: process.env.DB_MYSQL,
      connectionLimit: process.env.DB_CONNECTION_LIMIT,
    });

    
  }

  connectDB() {
    return new Promise((resolve, reject) => {
      this.poolAppUser.connect(err => {
        if (err) {
          console.error("Error connecting to MySQL database: " + err.stack);
          reject(err);
          return;
        }
        console.log(
          "Connected to MySQL database as id " + this.connection.threadId,
        );
        resolve();
      });
    });
  }
}

module.exports = new Database();