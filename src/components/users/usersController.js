const crypto = require("crypto");
const usersService = require("./usersService");
const statusCodes = require("../../enums/statusCodes");
const AuthenticatedController = require("../../shared/controllers/authenticated");

class UsersController extends AuthenticatedController {
    constructor(service) {
        super(service);
        this.create = this.create.bind(this);
        this.verify = this.verify.bind(this);
    }
    async create(req, res) {
        const desiredColumns = [ "username", "email", "password" ];
        if (req.body.password) req.body.password = crypto.createHmac("sha256", req.body.password).digest("hex");

        await super.create(req, res, desiredColumns, true);

        return;
    }
    async verify(req, res) {
        try {
            const { code } = req.body;
    
            if (!code) return res.status(statusCodes.BAD_REQUEST).send({ statusCode: statusCodes.BAD_REQUEST });
    
            const searchParams = { code };
            const message = await this.service.verify(searchParams);

            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("userControllers / authenticated UPD", err);
        }
    }
}

module.exports = new UsersController(usersService);
