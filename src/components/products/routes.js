const express = require("express");
const productsController = require("./productsController");

require("./models")();

const router = express.Router();

router.post("/", productsController.create);

router.get("/:id", (req, res) => productsController.getSingle(req, res));

router.get("/", (req, res) => productsController.getAll(req, res));

router.get("/que", (req, res) => productsController.getAll(req, res, 1));

router.get("/accepted", (req, res) => productsController.getAll(req, res, 2));

router.get("/declined", (req, res) => productsController.getAll(req, res, 3));

router.get("/admin", productsController.getAllAdmin);

router.patch("/admin/product", productsController.updateProductStatus);

router.post("/picture", productsController.insertPicture)

module.exports = router;
