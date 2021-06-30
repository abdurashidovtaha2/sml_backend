const express = require("express");
const UsersRouter = require("../components/users/routes");
const CategoriesRouter = require("../components/categories/routes");
const ProductsRouter = require("../components/products/routes");

const router = express.Router();

router.get("/testenv", (req, res) => {
    try {
        const h = process.env.ENV_TEST;
        console.log(h);

        res.status(200).send({resp: h});
    } catch (err) {
        console.log("error", err);
    }
})

router.use("/users", UsersRouter)
    .use("/products/categories", CategoriesRouter)
    .use("/products", ProductsRouter);

module.exports = router;
