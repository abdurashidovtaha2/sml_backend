const express = require("express");
const authController = require("./authController");
const usersController = require("./usersController");

require("./models")();

const router = express.Router();

router.get("/:id", (req, res) =>  usersController.getSingle(req, res, null, ["id", "email", "name", "surname", "admin"]));

router.get("/token/:id", (req, res) => authController.getSingle(req, res));

router.post("/signup", usersController.create);

router.post("/signup/code", usersController.verify);

router.post("/login", authController.login);

module.exports = router;
