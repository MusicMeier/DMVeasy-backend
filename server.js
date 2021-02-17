const app = require('express')();

const admin = require('firebase-admin');

const PORT = 2021;

const fetch = require('node-fetch')

const cors = require('cors')

const env = require('dotenv').config()

const apiKey = process.env.API_KEY

const fs = require('fs');

const Anvil = require('@anvilco/anvil');

const pdfTemplateID = '2H1hdiXvYLA1abriziAV'; 



app.use(cors())

app.options('*', cors())


// const anvil = require('./functions/controllers/anvilpdf')

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post('/anvil', (request, response) => {
  // console.log(request.body, 'this is ')
  const formData = request.body.formData;
  const applicantName = request.body.ApplicantName;
  const coAddress = request.body.COAddress;
  const coMailing = request.body.COMailing;
  const name = request.body.Name;
  const optometristAddress = request.body.OptometristAddress;
  const optometristPhone = request.body.OptometristPhone
  const renewelData = {
    "title": "DMV License Renewal",
    "fontSize": 10,
    "textColor": "#333333",
    "data": {
    "ApplicantName": {
        "firstName": applicantName.firstName,
        // 'dob': apllicantName.dob,
        "mi": applicantName.mi,
        "lastName": applicantName.lastName
    },
    "Suffix": formData.Suffix,
    "ApplicantHeight": formData.ApplicantHeight,
    "ApplicantWeight": formData.ApplicantWeight,
    "ApplicantHairColor": formData.ApplicantHairColor,
    "ApplicantEyeColor": formData.ApplicantEyeColor,
    "DLIDNumber": formData.DLIDNumber,
    "DOBMonth": formData.DOBMonth,
    "no": true,
    "yes": true,
    "COAddress": {
        "street1": coAddress.street1,
        "city": coAddress.city,
        "state": coAddress.state,
        "zip": coAddress.zip,
        "country": coAddress.country
    },
    "COMailing": {
        "street1": coMailing.street1,
        "city": coMailing.city,
        "state": coMailing.state,
        "zip": coMailing.zip,
        "country": coMailing.country
    },
    "Name": {
        "firstName": name.firstName,
        // 'dob': name.dob,
        "mi": name.mi,
        "lastName": name.lastName
    },
    "licenseNumber": formData.licenseNumber,
    "DOE": formData.Doe,
    "DateToday": formData.DateToday,
    "OptometristLicenseNumber": formData.OptometristLicenseNumber,
    "OptometristName": formData.OptometristName,
    "OptometristTitle": formData.OptometristTitle,
    "OptometristAddress": {
        "street1": optometristAddress.street1,
        "city": optometristAddress.city,
        "state": optometristAddress.state,
        "zip": optometristAddress.zip,
        "country": optometristAddress.country
    },
    "OptometristPhone": {
        "num": optometristPhone.num,
        "region": optometristPhone.region,
        "baseRegion": optometristPhone.baseRegion
    },
    "DrivingPrivilegeNo": formData.DrivingPrivilegeNo,
    "DrivingPrivilegeYes": formData.DrivingPrivilegeYes,
    "OtherStateNo": formData.OtherStateNo,
    "OtherStateYes": formData.OtherStateYes,
    "SafetyNo": formData.SafetyNo,
    "SafetyYes": formData.SafetyYes,
    "Required": formData.Required,
    "Not": formData.Not,
    "DOBDay": formData.DOBDay,
    "DOBYear": formData.DOBYear
    }
  }

  fetch(
    "https://app.useanvil.com/api/v1/fill/2H1hdiXvYLA1abriziAV.pdf"
,{
  method: 'POST',
  body: renewelData,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${apiKey}`,
    // 'Accept': 'application/pdf'
  },
})
.then(response => console.log('response.body here',response.body))
  .catch((err) => console.log(err));
})
// .then(response => {
  //   const anvilClient = new Anvil({ apiKey })
  
  //   const { data } = anvilClient.fillPDF(pdfTemplateID, response.body) 
  //   fs.writeFileSync('output.pdf', data, { encoding: null })
  // })
  
  // .then((data) => console.log(data))

// const data = JSON.stringify({
//   todo: 'Buy the milk'
// })

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


