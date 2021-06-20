const { v4: uuid } = require("uuid");
const connection = require("../../database");
const DBQuery = require("../../utils/DBQuery");
const Service = require("../../shared/service");
const sendEmail = require("../../utils/sendEmail");
const errorCodes = require("../../enums/errorCodes");
const statusCodes = require("../../enums/statusCodes");
const environment = require("../../environment");

class UsersService extends Service {
    constructor(...fields) {
        super(...fields);
    }
    async create(body) {
        try {
            const { email } = body;
            const existingEmail = await DBQuery(`SELECT * FROM users WHERE email=${connection.escape(email)} AND verified=1`);

            if (existingEmail.length) throw({ statusCode: statusCodes.DUPLICATE, err: errorCodes.EXISTS });

            const { statusCode, user_id: userID } = await super.create(body);
            const verificationCode = uuid();

            const mail = await sendEmail(
                email, "Нажмите на ссылку чтобы подвердить свою почту", "Подтверждение почты",
                "Подтверждение почты", `${environment.url}/confirmation/${email}/${verificationCode}`
            );

            await DBQuery(`INSERT INTO userVerificationCodes (id, user_id) VALUES (${connection.escape(verificationCode)}, ${connection.escape(userID)})`);

            return { statusCode, user_id: userID, emailInfo: mail };
        } catch (err) {
            throw(err);
        }
    }
    async verify(searchParams) {
        try {
            const { code } = searchParams

            const user = 
                await DBQuery(
                        `SELECT users.email, users.id FROM users JOIN userverificationcodes
                        ON userverificationcodes.user_id = users.id
                        WHERE userverificationcodes.id = ${connection.escape(code)}`, 
                        true, "VERIFICATION_CODE", statusCodes.NOT_FOUND
                    );
            const { email, id: userID } = user[0];
            const existingVerifiedEmail = await DBQuery(`SELECT * FROM users WHERE email=${connection.escape(email)} AND verified=1`);
            
            if (existingVerifiedEmail.length) throw({ statusCode: statusCodes.DUPLICATE, err: errorCodes.EXISTS });
                
            const token = uuid();

            await DBQuery(`DELETE FROM userverificationcodes WHERE id=${connection.escape(code)}`);
            await DBQuery(`UPDATE users SET verified=1 WHERE id=${connection.escape(userID)}`);
            await DBQuery(`INSERT INTO tokens (id, user_id) VALUES (${connection.escape(token)}, ${connection.escape(userID)})`);
            
            return { statusCode: statusCodes.OK, id: userID, token };
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = new UsersService("users", "USER");
