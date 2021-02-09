const functions = require("firebase-functions");

const app = require('express')();

const admin = require('firebase-admin');



const bodyParser = require('body-parser');

const serviceAccount = require('../serviceAccountKey.json')

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
    projectId: "dmveasy-a82ea",
    keyFilename: serviceAccount
})

app.use(bodyParser.json())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea-default-rtdb.firebaseio.com/'
});



// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});
