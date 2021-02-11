const functions = require("firebase-functions");

const app = require('express')();

const cors = require('cors')({origin: true});

const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');

const firebase = require('firebase');

const firebaseConfig = require('./utilities/firebaseConfig');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea.firebaseio.com/'
});

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

const bodyParser = require('body-parser');

//whats this? -KT
const { request, response } = require("express");

app.use(bodyParser.json());

//doesn't like this syntax, probably don't need it?
// const Firestore = require('@google-cloud/firestore');
// const db = new Firestore({
//     projectId: "dmveasy-a82ea",
//     keyFilename: serviceAccount
// })

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

exports.signUpWithEmailPassword = functions.https.onRequest((request,response) =>{
    cors(request, response, () => {
        const newUser = {
            id: request.body.uid,
            email: request.body.email,
            password: request.body.password,
        };

        let userid;

        db.doc(`/users/${newUser.id}`).get()
        .then((doc) => {
            if(doc.exists) {
                return response.json({ message: 'this user has been created' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userid = data.user.uid;
            return data.user.getIdToken();
            })
        .then((token) => {
            response.send({token: token, userId: userid});
        }).catch((error) => {
            response.send({errors: error});
        });
    });
});

exports.signInUserWithPasswordAndEmail = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = {
            email: request.body.email,
            password: request.body.password,
        }
        let userId; 
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            response.send({token: token, userId: userId});
        })
        .catch((error) => {
            response.send({errors: error});
        })
    })
})
