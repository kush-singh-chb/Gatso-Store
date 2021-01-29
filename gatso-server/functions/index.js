const functions = require("firebase-functions");
const { categoryApp } = require("./category");
const { productApp } = require("./product")
const { vendorApp } = require("./vendor")

exports.product = functions.region("eu-west1").https.onRequest(productApp);
exports.vendor = functions.region("eu-west1").https.onRequest(vendorApp);
exports.category = functions.region("eu-west1").https.onRequest(categoryApp)