const connection = require("../database");
const statusCodes = require("../enums/statusCodes");

const DBQuery = (sqlQuery, checkIfEmpty, field, statusCode) => {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, res) => {
            if (err) return reject({ statusCode: 500, err });
            if (checkIfEmpty && !res.length) return reject({ statusCode: statusCode || statusCodes.NOT_FOUND, err: `${field}_NOT_FOUND` });
            resolve(res);
        });
    });
};
// const DBQuery = (sqlQuery, checkIfEmpty, field, statusCode) => {
//     return new Promise((resolve, reject) => {
//         connection.getConnection(function(err, connPool) {
//             connPool.query(sqlQuery, (err, res) => {
//                 if (err) return reject({ statusCode: 500, err });
//                 if (checkIfEmpty && !res.length) return reject({ statusCode: statusCode || 400, err: `${field}_NOT_FOUND` });
//                 resolve(res);
                
//                 connPool.release();
//             });
//         })
//     });
// };

module.exports = DBQuery;
