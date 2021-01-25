const express = require("express");
const route = express.Router();
const fs = require("fs")
const { db, bucket } = require("../firebase")
const { logger } = require("firebase-functions");

route.post("/addVendor",(req,res)={

})

route.get("/getVendor",(req,res)={

})

module.exports = {
    route,
}