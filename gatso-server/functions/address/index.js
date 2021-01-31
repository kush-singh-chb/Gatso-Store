const express = require("express");
const cors = require("cors");
const fs = require("fs")
const { db, bucket } = require("../firebase")
const { logger } = require("firebase-functions");
const { v4: uuidv4 } = require("uuid")
const Busboy = require("busboy");
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { validateEircode } = require('../util')

//App CONFIG
const addressApp = express();

//MIDDLEWARE
addressApp.use(express.json());
addressApp.use(express.urlencoded({ extended: true }));
addressApp.use(fileMiddleware)
addressApp.use(cors({ origin: true }));
addressApp.use(decodeIDToken);

addressApp.get("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(400).send({ "message": 'Unauthorized.' })
    }
    db.collection("address").get().then(response => {
        return response.docs.map(doc => doc.data())
    }).then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(400).send({ "message": err.message })
    })
})

addressApp.get("/id/:id", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(400).send({ "message": 'Unauthorized.' })
    }
    if (req.params.id == undefined) {
        return res.status(400).send({ "message": "Address ID required." })
    }
    db.collection("address").doc(req.params.id).get().then(response => response.data())
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(400).send({ "message": err.message })
        })
})

addressApp.post("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(400).send({ "message": 'Unauthorized.' })
    }
    if (req.body.userID == undefined) {
        return res.status(400).send({ "message": "User ID required." })
    }
    if (req.body.address1 == null) {
        return res.status(400).send({ "message": "Atleast Address Line 1 required." })
    }
    if (req.body.city == null) {
        return res.status(400).send({ "message": "City required." })
    }
    if (req.body.eircode == null) {
        return res.status(400).send({ "message": "Eircode required." })
    }
    if (!validateEircode(req.body.eircode)) {
        return res.status(400).send({ "message": "Eircode Invalid." })
    }

    const data = {
        "id": uuidv4(),
        "address1": req.body.address1,
        "address2": req.body.address2,
        "city": req.body.city,
        "eircode": String(req.body.eircode).trim
    }
    db.collection("address").doc(data["id"]).set(data).then(response => Object.assign(data, response))
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(400).send({ "message": err.message })
        })
})

addressApp.put("/id/:id", (req, res) => {

})
addressApp.delete("/id/:id", (req, res) => {

})

module.exports = {
    addressApp
}