const express = require("express");
const swaggerDoc = require("./swagger.json")
const swaggerUi = require("swagger-ui-express");
const swaggerApp = express();

swaggerApp.use(express.json());
swaggerApp.use(express.urlencoded({ extended: true }));


swaggerApp.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, { explorer: true })
);

module.exports = {
    swaggerApp
}