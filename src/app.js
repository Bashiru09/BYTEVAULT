const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const authRoute = require("./modules/auth/auth.routes");
const fileRoute = require("./modules/file/file.routes");
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoute);
app.use("/file/v1", fileRoute);


module.exports = app;