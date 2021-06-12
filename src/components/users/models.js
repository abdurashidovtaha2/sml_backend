const DBQuery = require("../../utils/DBQuery");

module.exports = async () => {
    try {
        const createUsersTable = `create table if not exists users(
            id int primary key auto_increment not null,
            email varchar(255) not null,
            name varchar(255) not null,
            surname varchar(255) not null,
            verified int DEFAULT 0 not null,
            password varchar(255) not null,
            admin bool DEFAULT false not null,
            INDEX idx_email (email)
        )`;
        const createTokensTable = `create table if not exists tokens(
            id varchar(255) primary key not null,
            user_id int not null,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;
        const createUserVerificationCodesTable = `create table if not exists userVerificationCodes(
            id varchar(255) primary key not null,
            user_id int not null,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;

        await DBQuery(createUsersTable);
        await DBQuery(createTokensTable);
        await DBQuery(createUserVerificationCodesTable);
    } catch (err) {
        console.log("users / models ", err);
    }
}
