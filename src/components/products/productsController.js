const connection = require("../../database");
const errorCodes = require("../../enums/errorCodes");
const statusCodes = require("../../enums/statusCodes");
const AuthenticatedController = require("../../shared/controllers/authenticated");
const DBQuery = require("../../utils/DBQuery");
const productsService = require("./productsService");

class ProductsController extends AuthenticatedController {
    constructor(service) {
        super(service);
        this.getAll = this.getAll.bind(this);
        this.getAllAdmin = this.getAllAdmin.bind(this);
        this.updateProductStatus = this.updateProductStatus.bind(this);
        this.insertPicture = this.insertPicture.bind(this);
        this.search = this.search.bind(this);
        this.create = this.create.bind(this);
    }
    async insertPicture(req, res) {
        try {
            const token = req.headers.authorization;            

            if (!token) throw({ statusCode: statusCodes.BAD_REQUEST, err: errorCodes.DENIED });

            const userID = await this.service.checkToken(token);

            await this.service.insertPicture(req, res);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / insert picture", err);
        }
    }
    async create(req, res) {
        try {
            const token = req.headers.authorization;
            const userID = await this.service.checkToken(token);
            const user = await DBQuery(`SELECT username FROM users WHERE id = ${connection.escape(userID)}`);
            const { username } = user[0];
            const desiredColumns = [ "categoryID", "title", "fields", "price", "bargain", "pictures", "description", "phoneNumber", "username" ];
    
            req.body = { ...req.body, userName: username };

            await super.create(req, res, desiredColumns);
    
            return;
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / create", err);
        }
    }
    async getAll(req, res, status, admin) {
        try {
            const token = req.headers.authorization;

            if (!token) throw({ statusCode: statusCodes.BAD_REQUEST, err: errorCodes.DENIED });

            if (!status) status = 0;

            const userID = await this.service.checkToken(token);

            const message = await this.service.getAll(userID, status);
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / getall", err);
        }
    }
    async getAllAdmin(req, res) {
        try {
            const token = req.headers.authorization;

            if (!token) throw({ statusCode: statusCodes.BAD_REQUEST, err: errorCodes.DENIED });

            await this.service.checkTokenAdmin(token);

            const message = await this.service.getAll(null, null, true);
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / getalladmin", err);
        }
    }
    async updateProductStatus(req, res) {
        try {
            const token = req.headers.authorization;
            const { id, value } = req.body;

            if (!token) throw({ statusCode: statusCodes.BAD_REQUEST, err: errorCodes.DENIED });

            await this.service.checkTokenAdmin(token);

            const message = await this.service.updateProductStatus(id, value);
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / changeproductstatus", err);
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.body;

            const searchParams = { id };

            await super.delete(req, res, searchParams);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / delete", err);
        }
    }
    async search(req, res) {
        try {
            const { subCategory, category, searchField, minPrice, maxPrice, range } = req.query;
            const params = { subCategory, category, searchField, minPrice, maxPrice };
            // const token = req.headers.authorization;

            // await this.service.checkToken(token);

            const message = await this.service.search(range, params);
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("products / search", err);
        }
    }
};

module.exports = new ProductsController(productsService);
