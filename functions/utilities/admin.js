const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dmveasy-a82ea.firebaseio.com/',
    storageBucket: "dmveasy-a82ea.appspot.com"
});

const db = admin.firestore();

module.exports = { db };