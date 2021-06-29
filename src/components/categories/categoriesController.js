const statusCodes = require("../../enums/statusCodes");
const AuthenticatedController = require("../../shared/controllers/authenticated");
const categoriesService = require("./categoriesService");

class CategoriesController extends AuthenticatedController {
    constructor(service) {
        super(service);
        this.getAll = this.getAll.bind(this);
    }
    async getAll(req, res) {
        try {
            // const token = req.headers.authorization;

            // if (!token) throw({ statusCode: statusCodes.BAD_REQUEST, err: errorCodes.DENIED });

            // await this.service.checkToken(token);

            const message = await this.service.getAll();
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("categoriesController / getall", err);
        }
    }
}

module.exports = new CategoriesController(categoriesService);
