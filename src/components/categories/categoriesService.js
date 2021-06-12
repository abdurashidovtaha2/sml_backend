const connection = require("../../database");
const errorCodes = require("../../enums/errorCodes");
const statusCodes = require("../../enums/statusCodes");
const Service = require("../../shared/service");
const DBQuery = require("../../utils/DBQuery");

class CategoriesService extends Service {
    constructor(...fields) {
        super(...fields);
    }
    async getAll() {
        try {
            const categories = await DBQuery(`SELECT * FROM categories`);
            const result = await Promise.all(categories.map(async (category) => {
                const { id: categoryID, label } = category;
                
                const subcategories = await DBQuery(`SELECT * FROM subcategories WHERE category_id=${connection.escape(categoryID)}`);

                const subCategoriesResult = await Promise.all(subcategories.map(async (subcategory) => {
                    const { id: subcategoryID, label } = subcategory;

                    const productFields = await DBQuery(`SELECT * FROM productFields WHERE subcategory_id=${connection.escape(subcategoryID)}`);

                    const resultProductFields = productFields.map((productField) => {
                        const { id, label, subcategory_id } = productField;
                        return { id, categoryID: subcategory_id, title: label };
                    });

                    return { id: subcategoryID, value: `subcat${subcategoryID}`, label, children: [], info: resultProductFields };
                }));

                return { id: categoryID, label, value: `cat${categoryID}`, children: subCategoriesResult };
            }))

            return { statusCode: statusCodes.OK, categories: result };
        } catch (err) {
            throw(err);
        }
    }
}

module.exports = new CategoriesService("categories", "CATEGORY")
