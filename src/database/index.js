const MySql = require("mysql2");
// const connection = MySQL.createPool({
//   connectionLimit: 5,
//   user: "bba5dc84ff37d5",
//   password: "bbd46fcd",
//   host: "us-cdbr-east-03.cleardb.com",
//   database: "heroku_af4ae7528ff48ed",
// });

const connection = MySql.createPool({
    connectionLimit: 10,
    user: "root",
    password: "root",
    host: "127.0.0.1",
    port: "3306",
    database: "sml_db"
});

module.exports = connection;
