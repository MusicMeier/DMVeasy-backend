const app = require('express')();

const admin = require('firebase-admin');

const PORT = 2021;

const fetch = require('node-fetch')

const cors = require('cors')

const env = require('dotenv').config()

const apiKey = process.env.API_KEY

const fs = require('fs');

const Anvil = require('@anvilco/anvil');

const pdfTemplateID = 'vXnoWI7yAjDEF9ABmzxK'; 

app.use(cors())

app.options('*', cors())

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post('/anvil', async (request, response) => {
  const formData = request.body.formData;
  const applicantFullName = request.body.applicantFullName;
  const applicantName = request.body.applicantName
  const residentAddress = request.body.residentAddress;
  const mailingAddress = request.body.mailingAddress;
  const optometristAddress = request.body.optometristAddress;

  const renewelData = {
    "title": "DMV License Renewal",
    "fontSize": 10,
    "textColor": "#333333",
    "data": {
    "applicantName": {
        "firstName": applicantName.firstName,
        "mi": applicantName.mi,
        "lastName": applicantName.lastName
    },
    "applicantSuffix": formData.applicantSuffix,
    "applicantHeight": formData.applicantHeight,
    "applicantWeight": formData.applicantWeight,
    "applicantHairColor": formData.applicantHairColor,
    "applicantEyeColor": formData.applicantEyeColor,
    "DLIDnumber": formData.DLIDnumber,
    "applicantDOBMonth": formData.applicantDOBMonth,
    "applicantDOBDay": formData.applicantDOBDay,
    "applicantDOBYear": formData.applicantDOBYear,
    "currentMotorcyleEndorse": '',
    "retainMotorcyleEndorse": '',
    "drivingPrivilege": '',
    "outOfStateLicense": '',
    "outOfStateLicenseText": '',
    "drivingAbility": '',
    "residentAddress": {
        "street1": residentAddress.street1,
        "city": residentAddress.city,
        "state": residentAddress.state,
        "zip": residentAddress.zip,
        "country": residentAddress.country
    },
    "mailingAddress": {
        "street1": mailingAddress.street1,
        "city": mailingAddress.city,
        "state": mailingAddress.state,
        "zip": mailingAddress.zip,
        "country": mailingAddress.country
    },
    "applicantFullName": {
        "firstName": applicantFullName.firstName,
        "mi": applicantFullName.mi,
        "lastName": applicantFullName.lastName
    },
    "applicantDLIDNumber": formData.applicantDLIDNumber,
    "visionCheck": '',
    "optometristEvalDate": formData.optometristEvalDate,
    "optometristSignDate": formData.optometristEvalDate,
    "optometristLicenseNumber": formData.optometristLicenseNumber,
    "optometristTitle": formData.optometristTitle,
    "optometristAddress": {
        "street1": optometristAddress.street1,
        "city": optometristAddress.city,
        "state": optometristAddress.state,
        "zip": optometristAddress.zip,
        "country": optometristAddress.country
    },
    "optPhoneAreaCode": formData.optPhoneAreaCode,
    "optPhone": formData.optPhone, 
    }
  }
  console.log('second log',request.body.residentAddress.street1)
  const anvilClient = new Anvil({ apiKey })
  const {
    statusCode,
    data
  } = await anvilClient.fillPDF(pdfTemplateID, renewelData)
  if ( statusCode === 200 ) {
    let FormData = require('form-data')
    let formData = new FormData()
    formData.append('image', data, {filename: 'filled.pdf'})
    //this can be hardcoded as pdf or whatever folder name we want
    formData.append('folder', "pdf")
    //need to have the userId sent in the request to make dynamic
    formData.append('userId', "V6Yf3Dn3wvSEzHh9HCVBpjH33f02")
    fetch('http://localhost:5001/dmveasy-a82ea/us-central1/uploadImage', {
      method: "POST",
      headers: {},
      body: formData
    })
    .then(response => response.json())
    .then(result => response.send(result))
    .catch(error => response.send({errors: error}))
  } 
})  




// const options = {
//   hostname: 'whatever.com',
//   port: 443,
//   path: '/todos',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Length': data.length
//   }
// }

// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', d => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', error => {
//   console.error(error)
// })

// req.write(data)
// req.end()

// const functions = require('firebase-functions');

// exports.getUsers = functions.https.onRequest((request, response) => {
//   admin.firestore().collection('users').get()
//   .then(data => response.json())
// });

// const bodyParser = require('body-parser');

// const serviceAccount = require('./serviceAccountKey.json')

// const Firestore = require('@google-cloud/firestore');
// const db = new Firestore({
//   projectId: "dmveasy-a82ea",
//   keyFilename: serviceAccount
// })

// app.use(bodyParser.json())

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://dmveasy-a82ea-default-rtdb.firebaseio.com/'
// });








// const usersRef = db.collection('users');

// const snapshot = await db.collection('users').get();
// snapshot.forEach((doc) => {
//   console.log(doc.id, '=>', doc.data());
// });

// async function quickstartAddData(){

//   const kyleRef = db.collection('users').doc('kyle trahan');
  
//   await kyleRef.set({
//     first: 'kyle',
//     last: 'Trahan',
//     age: 31,
//     birthPlace: 'California'
//   });
  
  // const snapshot = db.collection('users').get()
  //   .then(response => console.log(response.json()))
  
  // console.log(snapshot,'here')
  // const snapshot = await db.collection('users').get();
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, '=>', doc.data());
  // });
// }
// quickstartAddData()



app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});
// app.get('/anvilForm', (request, response) => {
//   response.json({message: "Sup, DMVeasy crew!"})
// });

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));


