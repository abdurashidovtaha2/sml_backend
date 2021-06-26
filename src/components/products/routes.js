const express = require("express");
const DBQuery = require("../../utils/DBQuery");
const productsController = require("./productsController");

require("./models")();

const router = express.Router();

router.post("/", productsController.create);

router.get("/all", productsController.search);

router.get("/single/:id", (req, res) => productsController.getSingle(req, res));

router.get("/", (req, res) => productsController.getAll(req, res));

router.get("/que", (req, res) => productsController.getAll(req, res, 1));

router.get("/accepted", (req, res) => productsController.getAll(req, res, 2));

router.get("/declined", (req, res) => productsController.getAll(req, res, 3));

router.get("/admin", productsController.getAllAdmin);

router.put("/admin/product", productsController.updateProductStatus);

router.post("/picture", productsController.insertPicture);

router.delete("", productsController.delete);

router.delete("/all", async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (token !== "admin1982") {
            res.status(401).send({ statusCode: 401, err: "DENIED" });
            return;
        }
        
        await DBQuery(`DELETE FROM products`);

        res.status(200).send({ statusCode: 200 });
    } catch (err) {
        res.status(500).send({ err, statusCode: 500 });
    }
})

module.exports = router;
