const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const product = require("./product");
const vendor = require("./vendor")
const { auth } = require("./firebase")
const fileMiddleware = require('express-multipart-file-parser')

//App CONFIG
const app = express();

//MIDDLEWARE
async function decodeIDToken(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileMiddleware)
app.use(cors({ origin: true }));
app.use(decodeIDToken);


//API ROUTES
app.get("/", (req, res) => res.status(200).send("Hello World"));
app.use("/product", product.route);
app.use("/vendor",vendor.route);

//LISTEN COMMAND
exports.api = functions.region("eu-west1").https.onRequest(app);