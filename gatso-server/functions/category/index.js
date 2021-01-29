const express = require("express");
const fs = require("fs")
const { db, bucket, auth } = require("../firebase")
const { v4: uuidv4 } = require("uuid")
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { logger } = require("firebase-functions");
const cors = require("cors");
const Busboy = require("busboy")

const categoryApp = express()

categoryApp.use(express.json());
categoryApp.use(express.urlencoded({ extended: true }));
categoryApp.use(fileMiddleware)
categoryApp.use(cors({ origin: true }));
categoryApp.use(decodeIDToken);

categoryApp.post("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] === null) {
        return res.status(401).send({ "error": "Unauthorized" });
    }
    if (req.body.name === undefined) {
        return res.status(401).send({ "error": "Bad Request.\n Name Required." })
    }
    const id = uuidv4()
    const data = {
        id: id,
        name: req.body.name,
        createdOn: Date.now(),
        featured: false
    }
    db.collection("categories").doc(id).set(data).then(response => {
        return Object.assign(data, response)
    }).then(data => {
        return res.status(200).send(JSON.stringify(data))
    }).catch(err => {
        return res.status(400).send({ 'error': err })
    })
})

categoryApp.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] === null) {
        return res.status(401).send({ "error": "Unauthorized" });
    }
    db.collection("categories").get().then(response => {
        return response.docs.map(doc => doc.data())
    }).then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(400).send({ 'error': err })
    })
})

categoryApp.get('/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] === null) {
        return res.status(401).send({ "error": "Unauthorized" });
    }
    if (req.params.id === undefined) {
        return res.status(400).send({ "error": "Bad Request. ID required." })
    }
    db.collection("categories").doc(req.params.id).get().then(response => {
        return response.data()
    }).then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(400).send({ 'error': err })
    })
})

categoryApp.post("/subcategory", async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] === null) {
        return res.status(401).send({ "error": "Unauthorized" });
    }
    if (req.body.category_id === undefined) {
        return res.status(401).send({ "error": "Bad Request.\n Category Required." })
    }
    if (req.body.name === undefined) {
        return res.status(401).send({ "error": "Bad Request.\n Name Required." })
    }
    const category = await db.collection("categories").doc(req.params.category_id).get()
    if (!category.exists) {
        return res.status(404).send({ "error": "Category Not Found." })
    }
    const id = uuidv4()
    const data = {}
    data['id'] = id
    data['name'] = req.body.name
    data['category_id'] = req.body.category_id
    db.collection("sub-categories").doc(id).set(data)
        .then(response => Object.assign(data, response))
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(400).send({ "error": err })
        })
})

module.exports = { categoryApp }