const app = require('express')();

const admin = require('firebase-admin');

const PORT = 2021;

const bodyParser = require('body-parser');

const serviceAccount = require('./serviceAccountKey.json');

app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dmveasy-a82ea.firebaseio.com/'
});

const Firestore = require('@google-cloud/firestore');
const db = new  Firestore({
  projectId: "dmveasy-a82ea",
  keyFilename: serviceAccount
})

app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));


