const { v4: uuid } = require("uuid");
const connection = require("../../database");
const errorCodes = require("../../enums/errorCodes");
const statusCodes = require("../../enums/statusCodes");
const Service = require("../../shared/service");
const DBQuery = require("../../utils/DBQuery");

class AuthService extends Service {
    constructor(...fields) {
        super(...fields);
    }
    async login(email, password) {
        try {
            const user = await DBQuery(`SELECT * FROM users WHERE email=${connection.escape(email)} AND verified=1`, true, "USER", statusCodes.NOT_FOUND);
            const { id: userID, password: userPassword, admin } = user[0];
            const token = uuid();

            if (password !== userPassword) throw({ statusCode: statusCodes.FORBIDDEN, err: errorCodes.WRONG_PASSWORD });

            await DBQuery(`INSERT INTO tokens (id, user_id) VALUES (${connection.escape(token)}, ${connection.escape(userID)})`);

            const userType = admin === 1 ? "admin" : "user";

            return { statusCode: statusCodes.OK, id: userID, token, userType };
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = new AuthService("tokens", "TOKEN");
