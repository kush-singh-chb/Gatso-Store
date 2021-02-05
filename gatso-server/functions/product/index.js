const express = require("express");
const cors = require("cors");
const fs = require("fs")
const { db, bucket } = require("../firebase")
const { logger } = require("firebase-functions");
const { v4: uuidv4 } = require("uuid")
const Busboy = require("busboy");
const { decodeIDToken } = require("../middleware")
const fileMiddleware = require('express-multipart-file-parser')
const { body, param, validationResult } = require("express-validator");
const { promises } = require("dns");
const FirebaseFirestore = require("@google-cloud/firestore")

//App CONFIG
const productApp = express();

//MIDDLEWARE
productApp.use(express.json());
productApp.use(express.urlencoded({ extended: true }));
productApp.use(fileMiddleware)
productApp.use(cors());

productApp.use(decodeIDToken);


//API ROUTES

productApp.get("/", (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req["currentUser"] === null) {
    return res.status(401).send({ "message": "Unauthorized" });
  }
  var products = db.collection("products")
  if (req.query.q !== undefined) {
    products = products.where('name', '>=', req.query.q).where('name', '<=', req.query.q + '~');
  }
  if (req.query.vendor !== undefined) {
    products = products.where('vendor', '==', req.query.vendor)
  }
  if (req.query.orderBy !== undefined) {
    products = products.orderBy(req.query.orderBy)
  }
  if (req.query.limit !== undefined) {
    products = products.limit(parseInt(req.query.limit))
  }
  products.get().then(response => {
    return response.docs.map(doc => doc.data())

  }).then(async data => {
    for (var i in data) {
      const category = (await db.collection('categories').doc(data[i]['category']).get()).data()
      const vendor = (await db.collection('vendor').doc(data[i]['vendor']).get()).data()
      data[i]['category'] = (category != null) ? category : "Not Found. Check Reference and Update"
      data[i]['vendor'] = (vendor != null) ? vendor : "Not Found. Check Reference and Update"
    }
    res.status(200).send(JSON.stringify(data))
    return;
  }).catch(err => {
    res.status(400).send({ "message": err.message })
    return;
  })
})

productApp.get("/id/:id",
  param('id').notEmpty().withMessage("Bad Request")
  , async (req, res) => {
    res.set('Content-Type', 'application/json');

    if (req["currentUser"] === null) {
      return res.status(401).send({ "message": "Unauthorized" });
    }
    const error = validationResult(req)
    if (!error.isEmpty())
      await db.collection("products")
        .doc(req.params.id)
        .get().then(response => {
          return response.data()
        })
        .then(data => {
          res.status(200).send(data)
          return;
        }).catch(err => {
          res.status(400).send({ "message": err })
          return;
        })
  })

productApp.post("/",
  body('name').notEmpty().custom((value, { req }) => {
    return db.collection('products').where("name", '==', value).get().then(res => {
      console.log(res.docs.length)
      if (res.docs.length > 0) {
        throw new Error('Product Already Present');
      } else {
        return true
      }
    }).then(() => { }).catch(err => {throw new Error(err)})
  }),
  body('image').notEmpty(),
  body('description').notEmpty(),
  body('price').notEmpty().toInt(),
  body('vendor').notEmpty(),
  body('category').notEmpty(),
  async (req, res) => {
    res.set('Content-Type', 'application/json');
    const errors = validationResult(req)
    if (req["currentUser"] == null) {
      res.status(400).send({ "message": 'Unauthorized' })
      return
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ 'message': errors.array() });
    }
    const vendorDoc = db.collection("vendor").doc(req.body.vendor)
    const vendor = await vendorDoc.get()
    if (!vendor.exists) {
      return res.status(400).send({ "message": "Vendor ID not found" })
    }

    const categoryDoc = db.collection("categories").doc(req.body.category)
    const category = await categoryDoc.get()
    if (!category.exists) {
      return res.status(400).send({ "message": "Category ID not found" })
    }
    const data = {}
    data['id'] = uuidv4()
    data['name'] = req.body.name
    data['image'] = req.body.image
    data['price'] = req.body.price
    data['vendor'] = req.body.vendor
    data['category'] = req.body.category
    data['createdOn'] = Date.now()
    data['updatedOn'] = Date.now()
    db.collection("products")
      .doc(data['id'])
      .set(data)
      .then(response => Object.assign(data, response)).then(async (ndata) => {
        res.status(200).send(ndata)
        return;
      }).catch(err => {
        res.status(400).send({ "message": err.message })
        return;
      })
  })

productApp.delete("/id/:id", (req, res) => {
  res.set('Content-Type', 'application/json');

  if (req["currentUser"] === null) {
    return res.status(401).send({ "message": "Unauthorized" });
  }
  if (req.params.id === undefined) {
    res.status(400).send({ "message": "Bad Request" });
    return;
  }
  db.collection("products")
    .doc(req.params.id)
    .delete().then(response => {
      return response.data()
    })
    .then(() => {
      res.status(204).send({ "message": "OK" })
      return;
    }).catch(err => {
      res.status(400).send({ "message": err })
      return;
    })
})

productApp.put("/id/:id",
  body("image").isURL()
  , async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req["currentUser"] == null) {
      logger.log("setting bad")
      return res.status(400).send({ "message": 'Unauthorized' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.params.id == undefined) {
      return res.status(400).send({ "message": 'Bad Request' })
    }
    const data = {}
    for (const [key, value] in Object.entries(req.body)) {
      data[key] = value
    }
    if (data['category'] != null) {
      const categoryDoc = db.collection("categories").doc(req.body.category)
      const category = await categoryDoc.get()
      if (!category.exists) {
        return res.status(400).send({ "message": "Category ID not found" })
      }
      data['category'] = category.data()
    }
    data['updatedOn'] = Date.now()
    const productDoc = db.collection("products").doc(req.params.id)
    const product = productDoc.get()
    if (!(await product).exists) {
      return res.status(404).send({ "message": 'Product ID not Found' })
    }
    productDoc.update(data)
      .then(() => {
        productDoc.get()
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

productApp.post("/uploadProductImages", (req, res) => {
  res.set('Content-Type', 'application/json');
  const busboy = new Busboy({ headers: req.headers });
  if (req["currentUser"] == null) {
    return res.send({ "message": "Unauthorized" }).status(401).end();

  }
  if (req.files.length < 1) {
    return res.send({ "message": "Bad Request" }).sendStatus(400).end()

  }
  const fileMap = {}
  const promises = []
  // Listen for event when Busboy finds a file to stream.
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    // We are streaming! Handle chunks
    file.on('data', function (data) {

      fs.writeFileSync(`../uploads/${filename}`, Buffer.from(data, 'base64'), err => {
        if (err) {
          res.send({ "message": "Writing Error" }).status(400)
          return
        }
      })
      const metadata = {
        metadata: {
          // This line is very important. It's to create a download token.
          firebaseStorageDownloadTokens: uuidv4()
        },
        contentType: mimetype,
        cacheControl: 'public, max-age=31536000',
      };
      fileMap[filename] = metadata
    });

    // Completed streaming the file.

    file.on('end', async () => {
      console.log('uploading')
      promises.push(bucket.upload(`../uploads/${filename}`,
        {
          metadata: fileMap[filename],
          destination: `/ProductImages/${filename}`
        }).then(response => {

          return response[0]
        }).then(fileObj => {
          fileObj.makePublic(makePublicReponse => {
            return makePublicReponse
          })
          return fileObj.metadata.mediaLink
        }).catch(err => {
          return res.status(400).send({ 'message': "Unable to push to Storage" })
        }))
    })
  });
  busboy.on('finish', () => {
    Promise.all(promises).then(value => {
      console.log(value)
      return res.status(200).send({ url: value })
    })

  })

  busboy.end(req.rawBody);
});

productApp.put("/recentlyPurchased/:id", async (req, res) => {

})

//LISTEN COMMAND
module.exports = {
  productApp
}