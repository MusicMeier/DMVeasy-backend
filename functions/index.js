const functions = require("firebase-functions");

const app = require('express')();

const admin = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore()
const bodyParser = require('body-parser');

const serviceAccount = require('../serviceAccountKey.json')

// const Firestore = require('@google-cloud/firestore');
// const db = new Firestore({
//     projectId: "dmveasy-a82ea",
//     keyFilename: serviceAccount
// })

app.use(bodyParser.json())

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://dmveasy-a82ea.firebaseio.com/'
// });

exports.createUser = functions.https.onRequest(( request, response ) => {
    const newUser = {
        first: "tiffany"
    }
    db.collection('users').doc('tiffany').set(newUser)
})

exports.getUsers = functions.https.onRequest(( request, response ) => {
    const usersRef = db.collection('users')
    usersRef.get()
        .then(snapshots => {
            const arrUsers = snapshots.docs.map(element => element.data())
            response.send(arrUsers)
        }).catch(error => {
            response.status(500).send(error)
        })
})

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});
