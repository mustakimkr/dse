const DB = require("./connection");

const dbQuery = async (sqlQuery, values) => {
  return new Promise((resolve, reject) => {
    DB.query(sqlQuery, values, (error, result, fields) => {
      if (error) return reject(error);
      return resolve(result, fields);
    });
  });
};

module.exports = dbQuery;
