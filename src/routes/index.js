const express = require("express");
const UsersRouter = require("../components/users/routes");
const CategoriesRouter = require("../components/categories/routes");
const ProductsRouter = require("../components/products/routes");

const router = express.Router();

router.use("/users", UsersRouter)
    .use("/products/categories", CategoriesRouter)
    .use("/products", ProductsRouter);

module.exports = router;
