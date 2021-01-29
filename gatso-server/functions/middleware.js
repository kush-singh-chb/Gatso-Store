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
        } catch (err) {
            console.log(err);
        }
    }
    next();
}

module.exports = {
    decodeIDToken
}