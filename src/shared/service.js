const connection = require("../database");
const DBQuery = require("../utils/DBQuery");
const statusCodes = require("../enums/statusCodes");
const { buildSQLSearchQuery, buildSQLUpdateQuery } = require("../utils/library");

class Service {
    constructor(tableName, field) {
        this.getSingle = this.getSingle.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.create = this.create.bind(this);
        this.tableName = tableName;
        this.field = field;
    }
    async getSingle(searchParams, fieldParams) {
        try {
            const fields = fieldParams.reduce((acc, cur) => acc + ", " + cur);
            const condition = buildSQLSearchQuery(searchParams);
            const response = await DBQuery(`SELECT ${fields} FROM ${this.tableName} WHERE ${condition}`, true, this.field, statusCodes.NOT_FOUND);
            
            return { statusCode: statusCodes.OK, ...response[0] };
        } catch (err) {
            throw(err);
        }
    }
    async checkToken(token) {
        try {
            const user = await DBQuery(`SELECT * FROM tokens WHERE id=${connection.escape(token)}`, true, "TOKEN", statusCodes.UNAUTHENTICATED);
            const { user_id: userID } = user[0];

            return userID;
        } catch (err) {
            throw(err);
        }
    }
    async checkTokenAdmin(token) {
        try {
            const userFromToken = await DBQuery(`SELECT * FROM tokens WHERE id=${connection.escape(token)}`, true, "TOKEN", statusCodes.UNAUTHENTICATED);
            const { user_id: userID } = userFromToken[0];
            const user = await DBQuery(`SELECT admin FROM users WHERE id=${connection.escape(userID)}`);
            const { admin } = user[0];

            if (!admin) throw({ statusCode: statusCodes.FORBIDDEN });

            return userID;
        } catch (err) {
            throw(err);
        }
    }
    async create(body) {
        try {
            const fields = Object.keys(body);
            const values = Object.values(body).map(val => connection.escape(val));

            const columns = fields.reduce((acc, cur) => acc + ", " + cur);
            const columnValues = values.reduce((acc, cur) => acc + ", " + cur);
            
            const response = await DBQuery(`INSERT INTO ${this.tableName} (${columns}) VALUES (${columnValues})`);

            return { statusCode: statusCodes.CREATED, user_id: response.insertId };
        } catch (err) {
            throw(err);
        }
    }
    async update(searchParams, updateParams) {
        try {
            const condition = buildSQLSearchQuery(searchParams);// to search for in select* { name: "smth", archived: 0 }
            const statement = buildSQLUpdateQuery(updateParams);// to update { id: 2, status: 1, etc. }

            await DBQuery(`UPDATE ${this.tableName} SET ${statement} WHERE ${condition}`);

            return { statusCode: statusCodes.OK }
        } catch (err) {
            throw(err);
        }
    }
}

module.exports =  Service;
