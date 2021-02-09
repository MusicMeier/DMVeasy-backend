const app = require('express')();

const admin = require('firebase-admin');

const PORT = 2021;

const functions = require('firebase-functions');

exports.getUsers = functions.https.onRequest((request, response) => {
  admin.firestore().collection('users').get()
  .then(data => response.json())
});

const bodyParser = require('body-parser');

const serviceAccount = require('./serviceAccountKey.json')

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






// const usersRef = db.collection('users');

// const snapshot = await db.collection('users').get();
// snapshot.forEach((doc) => {
//   console.log(doc.id, '=>', doc.data());
// });

async function quickstartAddData(){

  const kyleRef = db.collection('users').doc('kyle trahan');
  
  await kyleRef.set({
    first: 'kyle',
    last: 'Trahan',
    age: 31,
    birthPlace: 'California'
  });
  
  // const snapshot = db.collection('users').get()
  //   .then(response => console.log(response.json()))
  
  // console.log(snapshot,'here')
  // const snapshot = await db.collection('users').get();
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });
}
quickstartAddData()



app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));


