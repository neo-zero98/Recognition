const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const app = express();

const serviceAccount = require("./private/permisos.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//abrir cors
app.use(cors());

// Routes
app.use(require("./routes/persona.router"));
app.use(require("./routes/usuario.router"));
app.use(require("./routes/personas-detectadas.router"));

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
