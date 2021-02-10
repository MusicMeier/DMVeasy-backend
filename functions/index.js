const functions = require("firebase-functions");

const app = require('express')();

const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea.firebaseio.com/'
});

const db = admin.firestore();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

//doesn't like this syntax
// const Firestore = require('@google-cloud/firestore');
// const db = new Firestore({
//     projectId: "dmveasy-a82ea",
//     keyFilename: serviceAccount
// })

exports.createUser = functions.https.onRequest(( request, response ) => {
    
    const newUser = {
        first: request.body.first
    };

    db.collection('users').add(newUser);

    response.send("You made a user!");
});

exports.getUsers = functions.https.onRequest(( request, response ) => {
    const usersRef = db.collection('users');
    usersRef.get()
        .then(snapshots => {
            const arrUsers = snapshots.docs.map(element => element.data());
            response.send(arrUsers);
        }).catch(error => {
            response.status(500).send(error);
        });
});

exports.getUser = functions.https.onRequest(( request, response ) => {
    const usersRef = db.collection('users').doc('music');
    usersRef.get()
    .then( snapshot => {
        if ( snapshot.exists ) {
            response.send(snapshot.data());
        } else {
            response.send("No existy");
        }
    });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});
