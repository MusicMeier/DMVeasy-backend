const app = require('express')();

const admin = require('firebase-admin');

const PORT = 2021;

const bodyParser = require('body-parser');

const serviceAccount = require('./serviceAccountKey.json')


app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dmveasy-a82ea-default-rtdb.firebaseio.com/'
});

const db = admin.database();

const usersRef = db.ref('/users');

usersRef.set({
  jrisawesome:{
    dob:"June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});

usersRef.on(
  "value", (snapshot) => {
    const result = snapshot.val()
    console.log(result)
  }
)

app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));


