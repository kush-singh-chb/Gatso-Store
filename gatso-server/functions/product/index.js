const express = require("express");
const route = express.Router();
const fs = require("fs")
const { db, bucket } = require("../firebase")
const { logger } = require("firebase-functions");
const { v4: uuidv4 } = require("uuid")
const Busboy = require("busboy");





route.post("/addProduct", (req, res) => {
  const busboy = new Busboy({ headers: req.headers })
  if (req["currentUser"] == null) {
    logger.log("setting bad")
    res.status(400).send({ 'error': 'Unauthorized' })
    return
  }
  const data = {}
  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    data[fieldname] = val
  });
  busboy.on('finish', () => {
    if (data['name'] === undefined || data['price'] === undefined || data["description"] === undefined
      || data["vendor"] === undefined || data['category'] === undefined || data['image'] === undefined) {
      res.status(400).send({ 'error': "Bad Request" })
      return;
    }
    data['createdOn'] = Date.now()
    data['updatedOn'] = Date.now()
    data['id'] = uuidv4()

    db.collection("products")
      .doc(data['id'])
      .set(data)
      .then(response => Object.assign(data,response)).then((ndata) => {
        res.status(200).send(ndata)
        return;
      }).catch(err => {
        res.status(400).send({ 'error': err })
        return;
      })



  });
  busboy.end(req.rawBody)
})

route.get("/getProduct/id=:id", (req, res) => {
  res.set('Content-Type', 'application/json');

  if (req["currentUser"] === null) {
    return res.status(401).send({ "error": "Unauthorized" });
  }
  if (req.params.id === undefined) {
    res.status(400).send({ "error": "Bad Request" });
  }
  db.collection("products")
    .doc(req.params.id).get()
    .then(response => response.data())
    .then(data => {
      res.status(200).send(JSON.stringify(data))
      return;
    }).catch(err => {
      res.status(400).send({ "error": err })
      return;
    })
})

route.post("/uploadProductImage", (req, res) => {
  res.set('Content-Type', 'application/json');
  const busboy = new Busboy({ headers: req.headers });
  if (req["currentUser"] === null) {
    res.send({ "error": "Unauthorized" }).status(401).end();
  } else if (req.files.length < 1) {
    res.send({ "error": "Bad Request" }).sendStatus(400).end()
  }


  // Listen for event when Busboy finds a file to stream.
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    // We are streaming! Handle chunks
    file.on('data', function (data) {
      fs.writeFileSync(`../uploads/${filename}`, Buffer.from(data, 'base64'), err => {
        if (err) {
          res.send({ "error": "Writing Error" }).status(400).end();
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
          res.send({ "error": "Uploading to Bucket" }).status(400).end();
        })
    });
  });
  busboy.end(req.rawBody);
});

route.get("/getAllProducts",(req,res)=>{
  
})
module.exports = {
  route,
};