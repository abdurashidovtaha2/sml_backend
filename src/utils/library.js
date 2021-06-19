const connection = require("../database");

const compareArrays = ( firstArr, secArr ) => {
    if (firstArr.map(a => a.toLowerCase()).sort().join('') !== secArr.map(a => a.toLowerCase()).sort().join('')) return false;
    return true;
};

const buildSQLSearchQuery = (searchParams) => {
    const fields = Object.keys(searchParams);
    const values = Object.values(searchParams).map(val => connection.escape(val));
    return fields.reduce((acc, cur, idx) => { return acc + `${cur}=${values[idx]}${idx !== (fields.length-1) ? " AND " : ""}` }, "");
};

const buildSQLUpdateQuery = (updateParams) => {
    const fields = Object.keys(updateParams);
    const values = Object.values(updateParams).map(val => connection.escape(val));
    return fields.reduce((acc, cur, idx) => { return acc + `${cur}=${values[idx]}${idx !== (fields.length-1) ? ", " : ""}` }, "");
};

const changeBackSlashes = (initString) => {
    return initString.split("").map(val => val === "\\" ? "/" : val ).join("");
};

module.exports = {
    compareArrays,
    changeBackSlashes,
    buildSQLSearchQuery,
    buildSQLUpdateQuery
}
