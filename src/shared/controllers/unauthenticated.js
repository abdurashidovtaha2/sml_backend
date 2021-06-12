const { compareArrays } = require("../../utils/library");

class UnauthenticatedController {
    constructor(service) {
        this.getSingle = this.getSingle.bind(this);
        this.create = this.create.bind(this);
        this.service = service;
    }
    async getSingle(req, res, fields) {
        try {
            const { id } = req.params;

            if (!id && !fields) throw({ statusCode: 400, err: "WRONG_FIELD_SENT" });
            
            const searchParams = (fields || { id });
            const message = await this.service.getSingle(searchParams, [ "*" ]);

            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(500).send("err");
            console.log("controllers / unauthenticated", err);
        }
    }
    async create(req, res, desiredColumns) {
        try {
            const body = req.body;
            const columns = Object.keys(body);
            
            if (!compareArrays(columns, desiredColumns)) throw({ statusCode: 400 });

            const message = await this.service.create(body);
            
            return res.status(message.statusCode).send(message);
        } catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err);
            }
            res.status(500).send("err");
            console.log("controllers / unauthenticated", err);
        }
    }
}

module.exports = UnauthenticatedController;
