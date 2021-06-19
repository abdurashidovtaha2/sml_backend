const crypto = require("crypto")
const authService = require("./authService");
const UnauthenticatedController = require("../../shared/controllers/unauthenticated");
const statusCodes = require("../../enums/statusCodes");

class AuthController extends UnauthenticatedController {
    constructor(service) {
        super(service);
        this.create = this.create.bind(this);
        this.login = this.login.bind(this);
    }
    async create(req, res) {
        const desiredColumns = [ "username", "surname", "email" ];

        await super.create(req, res, desiredColumns);

        return;
    }
    async login(req, res) {
        try {
            let { email, password } = req.body;

            if (!email || !password) throw({ statusCode: statusCodes.BAD_REQUEST });
    
            password = crypto.createHmac("sha256", password).digest("hex");

            const message = await this.service.login(email, password);
    
            return res.status(message.statusCode).send(message);F
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(500).send("err");
            console.log("users / authController", err);
        }
    }
}

    module.exports = new AuthController(authService);
