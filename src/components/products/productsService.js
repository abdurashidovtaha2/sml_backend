const connection = require("../../database");
const DBQuery = require("../../utils/DBQuery");
const Service = require("../../shared/service");
const statusCodes = require("../../enums/statusCodes");
const { changeBackSlashes } = require("../../utils/library");
const upload = require("../../utils/fileservice");
const environment = require("../../environment");

class ProductsService extends Service {
    constructor(...fields) {
        super(...fields);
    }
    async insertPicture(req, res) {
        try {
            upload(req, res, async (err) => {
                try {
                    if (err) {
                        throw({ statusCode: statusCodes.INTERNAL_ERROR , err });
                    }                
                    const imgName = req.file.filename;
                    
                    res.status(statusCodes.OK).send({ imageID: imgName });
                } catch (err) {
                    if (err.statusCode) {
                        return res.status(err.statusCode).send(err); 
                    }
                    res.status(statusCodes.INTERNAL_ERROR).send("err");
                    console.log("productservice / insert picture", err);
                }
            });
        } catch (err) {
            throw({ statusCode: statusCodes.INTERNAL_ERROR , err });
        }
    }
    async create(body, userID) {
        try {
            const { categoryID, pictures, title, fields, price, bargain, description, phoneNumber, userName } = body;
            const { insertId: productID } = await DBQuery(
                `INSERT INTO products (category_id, title, user_id, price, bargain, description,
                phoneNumber, userName) 
                VALUES (${connection.escape(categoryID)}, 
                ${connection.escape(title)}, ${connection.escape(userID)},
                ${connection.escape(price)}, ${connection.escape(bargain)},
                ${connection.escape(description)}, ${connection.escape(phoneNumber)},
                ${connection.escape(userName)})`
            );
            await Promise.all(pictures.map(async (pictureID) => {
                const link = `${environment.port}/${pictureID}`;
                await DBQuery(
                    `INSERT INTO productPictures (id, link, product_id)
                    VALUES (${connection.escape(pictureID)}, ${connection.escape(link)},
                    ${connection.escape(productID)})`
                );
            }));
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
    async getSingle(searchParams) {
        try {
            const { id: productID } = searchParams;
            const products = await DBQuery(`SELECT * FROM products WHERE id=${connection.escape(productID)}`);
            
            if (!products.length) return { statusCode: statusCodes.NOT_FOUND };

            const result = await Promise.all(products.map(async (product) => {
                const { id: productID, category_id: categoryID, title, status, price, description, bargain, phoneNumber, userName } = product;
                const pictures = await DBQuery(`
                    SELECT * FROM productpictures WHERE product_id = ${connection.escape(productID)}
                `);

                const fields =  await DBQuery(`
                    SELECT productfields.id, productfields.label, fieldproducts.value
                    FROM fieldproducts JOIN productfields
                    ON fieldproducts.product_id = ${connection.escape(productID)}
                    WHERE fieldproducts.field_id=productfields.id
                `);

                return { categoryID, productID, status, price, description, bargain, title, phoneNumber, username: userName, pictures, fields };
            }));

            return { statusCode: statusCodes.OK, product: result[0] };
        } catch (err) {
            throw(err);
        }
    }
    async getAll(userID, status, admin) {
        try {   
            let products = await DBQuery(`SELECT * FROM products WHERE user_id=${connection.escape(userID)} AND status=${connection.escape(status)}`);;
            if (Number(status) === 0) {
                products = await DBQuery(`SELECT * FROM products WHERE user_id=${connection.escape(userID)}`);
            }
            if (admin) {
                products = await DBQuery(`SELECT * FROM products WHERE status=1`);
            }
            const result = await Promise.all(products.map(async (product) => {
                const { id: productID, category_id: categoryID, title, status, price, description, bargain, phoneNumber, userName } = product;
                const pictures = await DBQuery(`
                    SELECT * FROM productpictures WHERE product_id = ${connection.escape(productID)}
                `);

                const fields =  await DBQuery(`
                    SELECT productfields.id, productfields.label, fieldproducts.value
                    FROM fieldproducts JOIN productfields
                    ON fieldproducts.product_id = ${connection.escape(productID)}
                    WHERE fieldproducts.field_id=productfields.id
                `);

                return { categoryID, productID, status, price, description, bargain, title, phoneNumber, username: userName, pictures, fields };
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
