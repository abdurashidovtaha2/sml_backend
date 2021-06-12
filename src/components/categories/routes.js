const express = require("express");
const categoriesController = require("./categoriesController");

require("./models")();

const router = express.Router();

router.get("/", categoriesController.getAll);

module.exports = router;
