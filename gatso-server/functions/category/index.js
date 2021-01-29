const express = require("express");
const fs = require("fs")
const { db, bucket, auth } = require("../firebase")
const { v4: uuidv4 } = require("uuid")
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { logger } = require("firebase-functions");
const cors = require("cors");
const Busboy = require("busboy");
const { throws } = require("assert");

const categoryApp = express()

categoryApp.use(express.json());
categoryApp.use(express.urlencoded({ extended: true }));
categoryApp.use(fileMiddleware)
categoryApp.use(cors({ origin: true }));
categoryApp.use(decodeIDToken);

categoryApp.post("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.body.name === undefined) {
        return res.status(401).send({ "message": "Bad Request.\n Name Required." })
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
    if (req["currentUser"] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    db.collection("categories").get().then(response => {
        return response.docs.map(doc => doc.data())
    }).then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(400).send({ 'error': err })
    })
})

categoryApp.get('/id/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.params.id === undefined) {
        return res.status(400).send({ "message": "Bad Request. ID required." })
    }
    db.collection("categories").doc(req.params.id).get().then(response => {
        if (!response.exists) {
            throw new Error("Category Not Found")
        }
        return response.data()
    })
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(404).send({ "message": err.message })
        })
})

categoryApp.delete('/id/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req['currentUser'] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.params.id === undefined) {
        return res.status(400).send({ "message": "Bad Request. ID required." })
    }

    db.collection("categories").doc(req.params.id).delete().then(response => {
        logger.log(response)
        return response
    }).then(() => {
        db.collection("sub-categories").where("category_id", "==", req.params.id).get()
            .then(async (response) => {
                const batch = db.batch()
                response.docs.forEach(doc => {
                    batch.delete(doc.ref)
                })
                await batch.commit()
                return res.status(202).send({ "message": "Deleted Category and all related Sub-Categories" })
            })
    }).catch(err => {
        return res.status(400).send({ 'error': err.message })
    })
})

categoryApp.post("/subcategory", async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.body.category_id === undefined) {
        return res.status(401).send({ "message": "Bad Request.\n Category Required." })
    }
    if (req.body.name === undefined) {
        return res.status(401).send({ "message": "Bad Request.\n Name Required." })
    }
    const category = await db.collection("categories").doc(req.body.category_id).get()
    if (!category.exists) {
        return res.status(404).send({ "message": "Category Not Found." })
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
            return res.status(400).send({ "message": err })
        })
})

categoryApp.get("/subcategory/id/:id", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req['currentUser'] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.params.id === undefined) {
        return res.status(401).send({ "message": "Bad Request. ID Required" });
    }
    db.collection("sub-categories").doc(req.params.id).get()
        .then(response => {
            if (!response.exists) {
                throw new Error("Sub-Category Not Found")
            }
            return response.data()
        })
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(404).send({ "message": err.message })
        })
})

categoryApp.get('/subcategory', (req, res) => {

    res.set('Content-Type', 'application/json');
    if (req['currentUser'] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    db.collection("sub-categories").get()
        .then(response => {
            if (response.docs === null) {
                throw new Error("Sub-Category Not Found")
            }
            return response.docs.map(doc => doc.data())
        })
        .then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(404).send({ "message": err.message })
        })
})

categoryApp.delete("/subcategory/id/:id", async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req['currentUser'] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.params.id === undefined) {
        return res.status(401).send({ "message": "Bad Request. ID Required" });
    }
    db.collection("sub-categories").doc(req.params.id).delete()
        .then(() => {
            return res.status(204).send({ "message": "OK" })
        }).catch(err => {
            return res.status(400).send({ "message": err })
        })
})

module.exports = { categoryApp }