const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');
const { signInUserWithPasswordAndEmail, signUpWithEmailPassword } = require('./controllers/auth');
const bodyParser = require('body-parser');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea.firebaseio.com/'
});

firebase.initializeApp(firebaseConfig);

//probably dont need
app.use(bodyParser.json());

exports.db = admin.firestore();
exports.signUp = signUpWithEmailPassword
exports.signIn = signInUserWithPasswordAndEmail

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


