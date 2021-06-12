const connection = require("../../database");
const DBQuery = require("../../utils/DBQuery");
const Service = require("../../shared/service");
const statusCodes = require("../../enums/statusCodes");

class ProductsService extends Service {
    constructor(...fields) {
        super(...fields);
    }
    async create(body, userID) {
        try {
            const { categoryID, title, fields } = body;
            const { insertId: productID } = await DBQuery(
                `INSERT INTO products (category_id, title, user_id) 
                VALUES (${connection.escape(categoryID)}, ${connection.escape(title)}, ${connection.escape(userID)})`
            );
            await Promise.all(fields.map(async (field) => {
                const { id: fieldID, value } = field;

                await DBQuery(`
                    INSERT INTO fieldProducts 
                    (product_id, field_id, value)
                    VALUES (${connection.escape(productID)}, ${connection.escape(fieldID)}, ${connection.escape(value)})`
                );
            }));

            return { statusCode: statusCodes.CREATED };
        } catch (err) {
            throw(err);
        }
    }
    async getAll(userID, status, admin) {
        try {
            // const { id: productID, category_id: categoryID, title } = 
            let products = await DBQuery(`SELECT * FROM products WHERE user_id=${connection.escape(userID)} AND status=${connection.escape(status)}`);;
            if (Number(status) === 0) {
                products = await DBQuery(`SELECT * FROM products WHERE user_id=${connection.escape(userID)}`);
            }
            if (admin) {
                products = await DBQuery(`SELECT * FROM products WHERE status=1`);
            }
            
            const result = await Promise.all(products.map(async (product) => {
                const { id: productID, category_id: categoryID, title, status } = product;
                const fields =  await DBQuery(`
                    SELECT productfields.id, productfields.label, fieldproducts.value
                    FROM fieldproducts JOIN productfields
                    ON fieldproducts.product_id = ${connection.escape(productID)}
                    WHERE fieldproducts.field_id=productfields.id
                `);

                return { categoryID, productID, status, title, fields };
            }));

            return { statusCode: statusCodes.OK, products: result };
        } catch (err) {
            throw(err);
        }
    }
    async updateProductStatus(id, value) {
        const searchParams = { id };
        const updateParams = { status: value };

        const resp = await super.update(searchParams, updateParams);

        return resp;
    }
}

module.exports = new ProductsService("products", "PRODUCT");
