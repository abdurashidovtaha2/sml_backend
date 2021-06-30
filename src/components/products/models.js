const DBQuery = require("../../utils/DBQuery");

module.exports = async () => {
    try {
        const createProductsTable = `create table if not exists products(
            id int primary key auto_increment not null,
            category_id int not null,
            parent_category_id int not null,
            status int DEFAULT 1 not null,
            user_id int not null,
            title varchar(255) not null,
            price varchar(255)  not null,
            bargain bool DEFAULT false not null,
            description text not null,
            phoneNumber int not null,
            userName varchar(255) not null,
            date bigint not null,
            viewedAmount int DEFAULT 0 not null,
            FOREIGN KEY (category_id) REFERENCES subcategories(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE CASCADE,
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
        const createProductPicturesTable = `create table if not exists productPictures(
            id varchar(255) primary key not null,
            link varchar(255) not null,
            product_id int not null,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`;
        // await DBQuery(`DELETE FROM products`);
        // await DBQuery(`ALTER TABLE products ADD FOREIGN KEY (parent_category_id) REFERENCES categories(id);`); 
        // SELECT * FROM products ORDER BY price DESC limit 5 OFFSET 2
        
        // await DBQuery(createProductsTable);
        // await DBQuery(createFieldProductsTable);
        // await DBQuery(createProductPicturesTable);
    } catch (err) {
        console.log(" products / models ", err);
    }
};
