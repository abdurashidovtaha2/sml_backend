const express = require("express");
const router = require("./routes");
const cors = require("cors");

const server = express();

server.use(express.json())
    .use(cors())
    .use("", router)
    .use(express.static("./images"));

server.listen(process.env.PORT || 8000, () => {
    console.log("server running on port 8000");
});
