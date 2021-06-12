const DBQuery = require("../../utils/DBQuery");

module.exports = async () => {
    try {
        const createProductsTable = `create table if not exists products(
            id int primary key auto_increment not null,
            category_id int not null,
            status int DEFAULT 1 not null,
            user_id int not null,
            title varchar(255) not null,
            FOREIGN KEY (category_id) REFERENCES subcategories(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;
        const createFieldProductsTable = `create table if not exists fieldProducts(
            id int primary key auto_increment not null,
            product_id int not null,
            field_id int not null,
            value varchar(255) not null,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (field_id) REFERENCES productFields(id) ON DELETE CASCADE
        )`;

        await DBQuery(createProductsTable);
        await DBQuery(createFieldProductsTable);
    } catch (err) {
        console.log(" products / models ", err);
    }
};
