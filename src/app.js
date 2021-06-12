const express = require("express");
const router = require("./routes");

const server = express();

server.use(express.json())
    .use("", router);

server.listen(process.env.PORT || 8000, () => {
    console.log("server running on port 8000");
});
