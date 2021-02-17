const app = require('express')();

const PORT = 2021;

const fetch = require('node-fetch')

const cors = require('cors')

const env = require('dotenv').config()

const apiKey = process.env.API_KEY

const Anvil = require('@anvilco/anvil');

const pdfTemplateID = 'vXnoWI7yAjDEF9ABmzxK'; 

app.use(cors())

app.options('*', cors())

const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

app.post('/anvil', async (request, response) => {

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
    formData.append('userId', "T1t7duwx5dZbGY1Kkm7XGsF3DaJ2")
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



