const express = require("express");
const fs = require("fs")
const { db, bucket, auth } = require("../firebase")
const { v4: uuidv4 } = require("uuid")
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { logger } = require("firebase-functions");
const cors = require("cors");
const Busboy = require("busboy");
const { body, validationResult } = require("express-validator");

const categoryApp = express()

categoryApp.use(express.json());
categoryApp.use(express.urlencoded({ extended: true }));
categoryApp.use(fileMiddleware)
categoryApp.use(cors({ origin: true }));
categoryApp.use(decodeIDToken);

categoryApp.post("/",
    body('name').notEmpty().withMessage("Name Required for this Request").custom(value => {
        return db.collection('categories').where('name', "==", value).get().then(res => {
            if (res.docs.length > 0) {
                throw new Error('Category already present.');
            } else {
                return true
            }
        }).then(res => { return res }).catch(err => { throw new Error(err) })
    }),
    body('vendor').notEmpty().withMessage("VendorID Required for this Request").custom(value => {
        return db.collection('vendor').doc(value).get().then(res => {
            if (!res.exists) {
                throw new Error('Vendor Not Found');
            } else {
                return true
            }
        }).then(res => { return res }).catch(err => { throw new Error(err) })
    })
    , (req, res) => {
        res.set('Content-Type', 'application/json');
        if (req["currentUser"] === null) {
            return res.status(401).send({ "message": "Unauthorized" });
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ "message": errors.array() });
        }
        const id = uuidv4()
        const data = {
            id: id,
            name: req.body.name,
            vendor: req.body.vendor,
            createdOn: Date.now(),
            featured: false
        }
        db.collection("categories").doc(id).set(data).then(response => {
            return Object.assign(data, response)
        }).then(data => {
            return res.status(200).send(JSON.stringify(data))
        }).catch(err => {
            return res.status(400).send({ "message": err })
        })
    })

categoryApp.get('/',
    body('vendor').optional({ nullable: true }).custom(value => {
        return db.collection('vendor').doc(value).get().then(response => {
            console.log(response.data);
            if (!response.exists) {
                throw new Error('Vendor Not Found');
            } else {
                return true
            }
        }).then(() => { }).catch(err => { throw new Error(err) })
    }),
    (req, res) => {
        res.set('Content-Type', 'application/json');
        if (req["currentUser"] == null) {
            return res.status(401).send({ "message": "Unauthorized" });
        }
        var categoryCollection = db.collection("categories")
        if (req.body.vendor !== undefined) {
            categoryCollection = categoryCollection.where('vendor', '==', req.body.vendor)
        }
        categoryCollection.get().then(response => {
            return response.docs.map(doc => doc.data())
        }).then(data => {
            return res.status(200).send(data)
        }).catch(err => {
            return res.status(400).send({ "message": err })
        })
    })

categoryApp.get('/id/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    if (req.query.id === undefined) {
        return res.status(400).send({ "message": "Bad Request. ID required." })
    }
    db.collection("categories").doc(req.query.id).get().then(response => {
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
    if (req.query.id === undefined) {
        return res.status(400).send({ "message": "Bad Request. ID required." })
    }

    db.collection("categories").doc(req.query.id).delete().then(response => {
        logger.log(response)
        return response
    }).then(() => {
        db.collection("sub-categories").where("category_id", "==", req.query.id).get()
            .then(async (response) => {
                const batch = db.batch()
                response.docs.forEach(doc => {
                    batch.delete(doc.ref)
                })
                await batch.commit()
                return res.status(202).send({ "message": "Deleted Category and all related Sub-Categories" })
            })
    }).catch(err => {
        return res.status(400).send({ "message": err.message })
    })
})

categoryApp.post("/subcategory", async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] === null) {
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
    if (req.query.id === undefined) {
        return res.status(401).send({ "message": "Bad Request. ID Required" });
    }
    db.collection("sub-categories").doc(req.query.id).get()
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
    if (req['currentUser'] === null) {
        return res.status(401).send({ "message": "Unauthorized" });
    }
    let collection = db.collection("sub-categories")
    if(req.query.category_id !== undefined){
        logger.log(req.query.category_id)
        collection = collection.where("category_id",'==',req.query.category_id)
    }
    collection.get()
        .then(response => {
            if (response.docs === null) {
                return JSON.stringify([])
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
    if (req.query.id === undefined) {
        return res.status(401).send({ "message": "Bad Request. ID Required" });
    }
    db.collection("sub-categories").doc(req.query.id).delete()
        .then(() => {
            return res.status(204).send({ "message": "OK" })
        }).catch(err => {
            return res.status(400).send({ "message": err })
        })
})

module.exports = { categoryApp }