const express = require("express");
const app = express();
const authRoutes = require("./modules/auth/auth.routes");
const fileRoutes = require("./modules/file/file.routes");
app.use(express.json());


app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});



app.use("/auth/v1", authRoutes);
app.use("api/v1/files", fileRoutes);



module.exports = app;