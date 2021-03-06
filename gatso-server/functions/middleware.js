const { logger } = require("firebase-functions");
const { auth } = require("./firebase")

async function decodeIDToken(req, res, next) {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        const idToken = req.headers.authorization.split("Bearer ")[1];
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            req["currentUser"] = decodedToken;
            if (decodeIDToken.vendor) {
                req['vendor'] == true
            }
        } catch (err) {
            logger.log(err);
        }
    }
    next();
}

module.exports = {
    decodeIDToken
}