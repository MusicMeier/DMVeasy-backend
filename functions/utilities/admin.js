const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea.firebaseio.com/',
});

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

module.exports = { db };