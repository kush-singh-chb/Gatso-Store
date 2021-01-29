const express = require("express");
const cors = require("cors");
const fs = require("fs")
const { db, bucket } = require("../firebase")
const { logger } = require("firebase-functions");
const { v4: uuidv4 } = require("uuid")
const Busboy = require("busboy");
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')

//App CONFIG
const addressApp = express();

//MIDDLEWARE
addressApp.use(express.json());
addressApp.use(express.urlencoded({ extended: true }));
addressApp.use(fileMiddleware)
addressApp.use(cors({ origin: true }));
addressApp.use(decodeIDToken);

addressApp.get("/", (req, res) => {

})

addressApp.get("/id/:id", (req, res) => {
    
})

addressApp.post("/", (req, res) => {

})

addressApp.put("/id/:id", (req, res) => {

})
addressApp.delete("/id/:id", (req, res) => {

})

module.exports = {
    addressApp
}