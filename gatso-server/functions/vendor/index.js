const express = require("express");
const fs = require("fs")
const { db, bucket, auth } = require("../firebase")
const { v4: uuidv4 } = require("uuid")
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { logger } = require("firebase-functions");
const cors = require("cors");
const { validateEircode } = require("../util")
const Busboy = require("busboy")



const vendorApp = express()

vendorApp.use(express.json());
vendorApp.use(express.urlencoded({ extended: true }));
vendorApp.use(fileMiddleware)
vendorApp.use(cors({ origin: true }));
vendorApp.use(decodeIDToken);

vendorApp.post("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.currentUser === null) {
        return res.status(400).send({ "message": "Unauthorized" })
    }
    const id = uuidv4()
    if (req.body.uid === null) {
        return res.status(400).send({ "message": 'Bad Request. UID required for this request' })
    }
    if (req.body.email === null) {
        return res.status(400).send({ "message": 'Bad Request. Email required for this request' })
    }
    if (req.body.eircode === null) {
        return res.status(400).send({ "message": 'Bad Request. EIR code required for this request' })
    }
    if (req.body.company_name === null) {
        return res.status(400).send({ "message": 'Bad Request. Company Name required for this request' })
    }
    if (!validateEircode(req.body.eircode)) {
        return res.status(400).send({ "message": "Eircode Invalid." })
    }
    auth.setCustomUserClaims(req.body.uid, { vendor: true, back_id: id }).then(response => {
        return response
    }).then(() => {
        const data = {
            id: id,
            uid: req.body.uid,
            email: req.body.email,
            vendor: true,
            eircode: req.body.eircode,
            createdOn: Date.now(),
            updatedOn: Date.now(),
        }
        db.collection("vendor").doc(id).set(data).then(response => Object.assign(response, data)).then(() => {
            return res.status(200).send(data)
        }).catch(err => logger.log(err.message))
    }).catch(err => {
        return res.status(400).send({ "message": "Unauthorized. " + err.message })
    })

})

vendorApp.get('/get', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.currentUser === null) {
        return res.status(400).send({ "message": "Unauthorized" })
    }
    const vendor = db.collection("vendor")
    if (req.query.orderBy !== null) {
        vendor = vendor.orderBy(req.query.orderBy)
    }
    if (req.query.limit !== null) {
        vendor = vendor.limit(parseInt(req.query.limit))
    }
    vendor.get().then(response => {
        return response.docs.map(doc => doc.data())

    }).then(data => {
        return res.status(200).send(JSON.stringify(data))
    }).catch(err => {
        return res.status(400).send(JSON.stringify(err.message))
    })

})

vendorApp.get('id/:id', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.currentUser === null) {
        return res.status(400).send({ "message": "Unauthorized" })
    }
    if (req.params.id === null) {
        return res.status(400).send({ "message": 'ID required for this request.' })
    }
    db.collection("vendor")
        .doc(req.params.id)
        .get().then(response => {
            return response.data()
        }).then(data => {
            return res.status(200).send(JSON.stringify(data))
        }).catch(err => {
            return res.status(400).send(JSON.stringify(err))
        })
})

vendorApp.put("id/:id", (req, res) => {
    res.set('Content-Type', 'application/json');
    const busboy = new Busboy({ headers: req.headers })
    if (req.currentUser === null) {
        return res.status(400).send({ "message": "Unauthorized" })
    }
    if (req.params.id === null) {
        return res.status(400).send({ "message": 'ID required for this request.' })
    }
    const data = {}
    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        data[fieldname] = val
    })
    busboy.on('finish', async () => {
        data['UpdatedOn'] = Date.now()
        const vendorDoc = db.collection("vendor").doc(req.params.id)
        const vendor = await vendorDoc.get()
        if (!(await vendor).exists) {
            return res.status(400).send({ "message": "Vendor ID not found" })
        }
        vendorDoc.update(data)
            .then(() => {
                vendorDoc.get()
                    .then(response => response.data())
                    .then(data => {
                        res.status(200).send(JSON.stringify(data))
                        return;
                    }).catch(err => {
                        res.status(400).send({ "message": err })
                        return;
                    })
            })


    })
    busboy.end(req.rawBody)
})

module.exports = {
    vendorApp,
}