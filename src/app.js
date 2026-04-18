const express = require("express");
const routes = express();
const authRoute = require("./modules/auth/auth.routes");
const fileRoute = require("./modules/file/file.routes");
routes.use(express.json());



routes.use("/api/v1/auth", authRoute);
routes.use("/file/v1", fileRoute);


module.exports = routes;