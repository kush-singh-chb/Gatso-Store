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
const productApp = express();

//MIDDLEWARE
productApp.use(express.json());
productApp.use(express.urlencoded({ extended: true }));
productApp.use(fileMiddleware)
productApp.use(cors({ origin: true }));
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
  if (req.query.orderBy !== undefined) {
    products = products.orderBy(req.query.orderBy)
  }
  if (req.query.limit !== undefined) {
    products = products.limit(parseInt(req.query.limit))
  }
  products.get().then(response => {
    return response.docs.map(doc => doc.data())

  })
    .then(data => {
      res.status(200).send(JSON.stringify(data))
      return;
    }).catch(err => {
      res.status(400).send({ "message": err })
      return;
    })
})

productApp.get("/id/:id", async (req, res) => {
  res.set('Content-Type', 'application/json');

  if (req["currentUser"] === null) {
    return res.status(401).send({ "message": "Unauthorized" });
  }
  if (req.params.id === undefined) {
    res.status(400).send({ "message": "Bad Request" });
    return;
  }
  await db.collection("products")
    .doc(req.params.id)
    .get().then(response => {
      return response.data()
    })
    .then(data => {
      logger.log(data)
      res.status(200).send(data)
      return;
    }).catch(err => {
      res.status(400).send({ "message": err })
      return;
    })
})

productApp.post("/", (req, res) => {
  const busboy = new Busboy({ headers: req.headers })
  res.set('Content-Type', 'application/json');
  if (req["currentUser"] == null) {
    logger.log("setting bad")
    res.status(400).send({ 'error': 'Unauthorized' })
    return
  }
  const data = {}
  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    data[fieldname] = val
  });
  busboy.on('finish', async () => {
    if (data['name'] === undefined || data['price'] === undefined || data["description"] === undefined
      || data["vendor"] === undefined || data['category'] === undefined || data['image'] === undefined) {
      res.status(400).send({ 'error': "Bad Request" })
      return;
    }
    const vendorDoc = db.collection("vendor").doc(data["vendor"])
    const vendor = await vendorDoc.get()
    if (!vendor.exists) {
      return res.status(400).send({ "message": "Vendor ID not found" })
    }

    const categoryDoc = db.collection("categories").doc(data["category"])
    const category = await categoryDoc.get()
    if (!category.exists) {
      return res.status(400).send({ "message": "Category ID not found" })
    }
    data['category'] = category.data()
    data['createdOn'] = Date.now()
    data['updatedOn'] = Date.now()
    data['id'] = uuidv4()

    db.collection("products")
      .doc(data['id'])
      .set(data)
      .then(response => Object.assign(data, response)).then((ndata) => {
        res.status(200).send(ndata)
        return;
      }).catch(err => {
        res.status(400).send({ 'error': err })
        return;
      })
  });
  busboy.end(req.rawBody)
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

productApp.put("/id/:id", (req, res) => {
  res.set('Content-Type', 'application/json');
  const busboy = new Busboy({ headers: req.headers })
  if (req["currentUser"] == null) {
    logger.log("setting bad")
    return res.status(400).send({ 'error': 'Unauthorized' })
  }

  if (req.params.id == undefined) {
    return res.status(400).send({ 'error': 'Bad Request' })
  }
  const data = {}
  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    data[fieldname] = val
  })
  busboy.on('finish', async () => {
    data['updatedOn'] = Date.now()
    const productDoc = db.collection("products").doc(req.params.id)
    const product = productDoc.get()
    if (!(await product).exists) {
      return res.status(404).send({ 'error': 'Product ID not Found' })
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
  busboy.end(req.rawBody)
})

productApp.post("/uploadProductImage", (req, res) => {
  res.set('Content-Type', 'application/json');
  const busboy = new Busboy({ headers: req.headers });
  if (req["currentUser"] === null) {
    res.send({ "message": "Unauthorized" }).status(401).end();
  } else if (req.files.length < 1) {
    res.send({ "message": "Bad Request" }).sendStatus(400).end()
  }


  // Listen for event when Busboy finds a file to stream.
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    // We are streaming! Handle chunks
    file.on('data', function (data) {
      fs.writeFileSync(`../uploads/${filename}`, Buffer.from(data, 'base64'), err => {
        if (err) {
          res.send({ "message": "Writing Error" }).status(400).end();
        }
      })
    });

    // Completed streaming the file.
    file.on('end', () => {
      const metadata = {
        metadata: {
          // This line is very important. It's to create a download token.
          firebaseStorageDownloadTokens: uuidv4()
        },
        contentType: mimetype,
        cacheControl: 'public, max-age=31536000',
      };

      bucket.upload(`../uploads/${filename}`,
        {
          metadata: metadata,
          destination: `/ProductImages/${filename}`
        }).then(response => {
          res.send({ "url": response[0].metadata.selfLink }).sendStatus(200).end()
        }).catch(err => {
          res.send({ "message": "Uploading to Bucket" }).status(400).end();
        })
    });
  });
  busboy.end(req.rawBody);
});

productApp.put("/recentlyPurchased/:id", async (req, res) => {

})

//LISTEN COMMAND
module.exports = {
  productApp
}