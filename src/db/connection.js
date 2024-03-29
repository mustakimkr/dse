const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

db.connect((e) => {
  if (e) {
    console.log("Something went wrrong mysql!");
    return e;
  }
  console.log("mysql connected!");
});

module.exports = db;
