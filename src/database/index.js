const MySql = require("mysql2");
const connection = MySql.createPool({
  connectionLimit: 5,
  user: "b1e204a5b58247",
  password: "ef0ab7f9",
  host: "us-cdbr-east-04.cleardb.com",
  database: "heroku_e6c4962d6553d26",
});
//mysql://b1e204a5b58247:ef0ab7f9@us-cdbr-east-04.cleardb.com/heroku_e6c4962d6553d26?reconnect=true
// mysql --host=us-cdbr-east-04.cleardb.com --user=b1e204a5b58247 --password=ef0ab7f9 --reconnect heroku_e6c4962d6553d26
// const connection = MySql.createPool({
//     connectionLimit: 10,
//     user: "root",
//     password: "root",
//     host: "127.0.0.1",
//     port: "3306",
//     database: "sml_db"
// });

module.exports = connection;
