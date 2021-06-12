const DBQuery = require("../../utils/DBQuery");

module.exports = async () => {
    try {
        const createCategoriesTable = `create table if not exists categories(
            id int primary key auto_increment not null,
            label varchar(255) not null
        )`;
        const createSubCategoriesTable = `create table if not exists subCategories(
            id int primary key auto_increment not null,
            label varchar(255) not null,
            category_id int not null,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )`;
        const createProductFieldsTable = `create table if not exists productFields(
            id int primary key auto_increment not null,
            label varchar(255) not null,
            subcategory_id int not null,
            FOREIGN KEY (subcategory_id) REFERENCES subCategories(id) ON DELETE CASCADE
        )`;

        await DBQuery(createCategoriesTable);
        await DBQuery(createSubCategoriesTable);
        await DBQuery(createProductFieldsTable);

        // await DBQuery(enterMockData);
        const enterMockData  = `
            INSERT INTO categories (label) VALUES ("Transport");
            INSERT INTO categories (label) VALUES ("Real estate");
            INSERT INTO subcategories (label, category_id) VALUES ("Car", 1);
            INSERT INTO subcategories (label, category_id) VALUES ("Bus", 1);
            INSERT INTO subcategories (label, category_id) VALUES ("Airplane", 1);
            INSERT INTO subcategories (label, category_id) VALUES ("House", 2);
            INSERT INTO subcategories (label, category_id) VALUES ("Apartment", 2);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Horse Power", 1);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Price", 1);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Speed", 1);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Weight", 2);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Capacity", 2);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Price", 2);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Weight", 3);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Capacity", 3);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Price", 3);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Price", 4);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Area", 4);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Room amount", 4);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Price", 5);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Area", 5);
            INSERT INTO productFieldsTable (label, subcategory_id) VALUES ("Floor level", 5);
        `;
    } catch (err) {
        console.log(" categories / models ", err);
    }
};