const admin = require("firebase-admin");
const serviceAccount = require("../gatso-2020-firebase-adminsdk-zdiod-39145e3fb6.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://gatso-2020.appspot.com",
});
const bucket = admin.storage().bucket()
const db = admin.firestore()
const auth = admin.auth()
module.exports = {
    db, bucket, auth
}