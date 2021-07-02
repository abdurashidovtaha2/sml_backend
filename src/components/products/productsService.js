const connection = require("../../database");
const DBQuery = require("../../utils/DBQuery");
const Service = require("../../shared/service");
const statusCodes = require("../../enums/statusCodes");
const { changeBackSlashes, buildSQLSearchQuery, buildSQLUpdateQuery } = require("../../utils/library");
const upload = require("../../utils/fileservice");
const environment = require("../../environment");
const { uploadFile, uploadFileS3 } = require("../../s3");
const errorCodes = require("../../enums/errorCodes");

class ProductsService extends Service {
    constructor(...fields) {
        super(...fields);
        this.getProductFields = this.getProductFields.bind(this);
        this.search = this.search.bind(this);
    }
    async insertPicture(req, res) {
        try {
            upload(req, res, async (err) => {
                try {
                    if (err) {
                        throw({ statusCode: statusCodes.INTERNAL_ERROR , err });
                    }
                    const imgName = req.file.filename;

                    const response = await uploadFileS3(req.file);
                    console.log(response);

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
    async update(userID, body) {
        try {
            const { productID, title, price, bargain, phoneNumber, description, pictures, fields } = body;

            const product = await DBQuery(`SELECT user_id FROM products WHERE id = ${connection.escape(productID)}`, true, "PRODUCT");
            const { user_id: productUserID } = product[0];

            if (userID !== productUserID) throw({ statusCode: statusCodes.FORBIDDEN, err: errorCodes.DENIED });

            const updateProductParams = { title, price, bargain, phoneNumber, description };
            const updateStatement = buildSQLUpdateQuery(updateProductParams);

            await DBQuery(`UPDATE products SET ${updateStatement} WHERE id=${connection.escape(productID)}`);

            await DBQuery(`DELETE FROM fieldProducts WHERE product_id=${connection.escape(productID)}`);
            await DBQuery(`DELETE FROM productPictures WHERE product_id=${connection.escape(productID)}`);
            await Promise.all(pictures.map(async (pictureID) => {
                const link = `${environment.pictureLink}/${pictureID}`;

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

            return { statusCode: 200 };
        } catch (err) {
            throw(err);
        }
    }
    async create(body, userID) {
        try {
            const DATE = Date.now();
            const { categoryID, pictures, title, fields, price, bargain, description, phoneNumber, userName } = body;

            const cat = await DBQuery(`SELECT category_id FROM subcategories WHERE id=${connection.escape(categoryID)}`);

            if (!cat.length) throw({ statusCode: statusCodes.BAD_REQUEST });

            const { category_id: parent_category_id } = cat[0];

            const { insertId: productID } = await DBQuery(
                `INSERT INTO products (category_id, title, user_id, price, bargain, description,
                phoneNumber, userName, date, parent_category_id) 
                VALUES (${connection.escape(categoryID)}, 
                ${connection.escape(title)}, ${connection.escape(userID)},
                ${connection.escape(price)}, ${connection.escape(bargain)},
                ${connection.escape(description)}, ${connection.escape(phoneNumber)},
                ${connection.escape(userName)}, ${connection.escape(DATE)},
                ${connection.escape(parent_category_id)})`
            );
            await Promise.all(pictures.map(async (pictureID) => {
                const link = `${environment.pictureLink}/${pictureID}`;
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
    async getProductFields(products) {
        try {
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

            return result;
        } catch (err) {
            throw(err);
        }
    }
    async getSingle(searchParams) {
        try {
            const { id: productID } = searchParams;
            const products = await DBQuery(`SELECT * FROM products WHERE id=${connection.escape(productID)}`);
            await DBQuery(`UPDATE products SET viewedAmount = viewedAmount + 1`);
            
            if (!products.length) return { statusCode: statusCodes.NOT_FOUND };

            const product = await this.getProductFields(products);

            return { statusCode: statusCodes.OK, product: product[0] };
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
            const result = await this.getProductFields(products);

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
    async search(range, searchParams) {
        try {
            const { category: parent_category_id, subCategory: category_id, searchField, minPrice, maxPrice } = searchParams;
            const params = { parent_category_id, category_id };

            const conditionParams = { status: 2 };
            let input = "";
            
            for (const key in params) {
                if (params.hasOwnProperty(key) && params[key] && params[key] !== "null") {
                    conditionParams[key] = params[key];
                }
            }
            const condition = buildSQLSearchQuery(conditionParams);

            if (searchField) {
                if (condition.length) input = "AND ";
                input += `title LIKE ${connection.escape(`%${searchField}%`)}`;
            }

            let priceRange = "";
            if ((input.length || condition.length) && (minPrice || maxPrice)) priceRange = "AND ";

            if (minPrice) priceRange += `price > ${connection.escape(minPrice)}`;
            if (maxPrice) {
                if (minPrice) priceRange += "AND "
                priceRange += `price < ${connection.escape(maxPrice)}`;
            }

            let where = "";
            if (condition.length || input.length || priceRange.length) where = "WHERE";

            const products = await DBQuery(`
                SELECT * FROM products
                ${where}
                ${condition}
                ${input}
                ${priceRange}
                ORDER BY viewedAmount DESC limit 10 OFFSET ${Number(range)*10}
            `);

            const result = await this.getProductFields(products);

            return { statusCode: statusCodes.OK, products: result };
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = new ProductsService("products", "PRODUCT");
