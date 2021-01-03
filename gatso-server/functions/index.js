const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require("express");
const cors = require("cors");
const other = require("./other")

admin.initializeApp();
//API

//App CONFIG
const app = express();

//MIDDLEWARE
async function decodeIDToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        functions.logger.log("Found idToken", idToken);
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
            next();
        } catch (err) {
            console.log(err);
        }
    } else {
        return res.status(401).send("Authentication Error")
    }
}


app.use(cors({ origin: true }));
app.use(express.json());
app.use(decodeIDToken);


//API ROUTES
app.get("/", (req, res) => res.status(200).send("Hello World"));
app.use("/other", other.route)


//LISTEN COMMAND
exports.api = functions.region("eu-west1").https.onRequest(app);