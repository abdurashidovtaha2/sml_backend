const statusCodes = require("../../enums/statusCodes");
const { compareArrays } = require("../../utils/library");

class AuthenticatedController {
    constructor(service) {
        this.getSingle = this.getSingle.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.service = service;
    }
    async getSingle(req, res, fields, requestedColumns) {
        try {
            const token = req.headers.authorization;
            const { id } = req.params;
            
            if ((!id && !fields) || !token) throw({ statusCode: statusCodes.BAD_REQUEST, err: "WRONG_FIELD_SENT" });
            
            const searchParams = (fields || { id });
            if (!requestedColumns) requestedColumns = [ "*" ];

            await this.service.checkToken(token);
            
            const message = await this.service.getSingle(searchParams, requestedColumns);

            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("controllers / authenticated GS", err);
        }
    }
    async create(req, res, desiredColumns, skipTokenCheck) {
        try {
            let userID;
            if (!skipTokenCheck) {
                const token = req.headers.authorization;
    
                if (!token) throw({ statusCode: 400, err: "WRONG_FIELD_SENT" });

                userID = await this.service.checkToken(token);
            }
            let body = req.body;
            const columns = Object.keys(body);
            
            if (!compareArrays(columns, desiredColumns)) throw({ statusCode: statusCodes.BAD_REQUEST });
            
            const message = await this.service.create(body, userID);
            
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("controllers / authenticated CR", err);
        }
    }
    async update(req, res, updateParams, searchParams) {
        try {
            const message = await this.service.update(searchParams, updateParams);

            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("controllers / authenticated UPD", err);
        }
    }
    async delete(req, res, searchParams) {
        try {
            const token = req.headers.authorization;

            const user_id = await this.service.checkToken(token);

            searchParams = { ...searchParams, user_id };

            const message = await this.service.delete(searchParams);

            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(statusCodes.INTERNAL_ERROR).send("err");
            console.log("controllers / authenticated DEL", err);
        }
    }
}

module.exports = AuthenticatedController;
