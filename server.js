const app = require('express')();
const PORT = process.env.PORT || 2021;
const fetch = require('node-fetch');
const cors = require('cors');
const env = require('dotenv').config();
const apiKey = process.env.API_KEY
const Anvil = require('@anvilco/anvil');
const pdfTemplateID = 'vXnoWI7yAjDEF9ABmzxK'; 
const bodyParser = require('body-parser');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

app.get('/', (request, response) => {
  response.json({message: "I'm a working server"})
});

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
  };
  
  const anvilClient = new Anvil({ apiKey })
  const {
    statusCode,
    data
  } = await anvilClient.fillPDF(pdfTemplateID, renewelData);
  
  if ( statusCode === 200 ) {
    let FormData = require('form-data');
    let formData = new FormData();
    formData.append('image', data, {filename: 'filled.pdf'});
    formData.append('folder', "pdf");
    formData.append('userId', request.body.userId);
    fetch('https://us-central1-dmveasy-a82ea.cloudfunctions.net/uploadImage', {
      method: "POST",
      headers: {},
      body: formData
    })
    .then(response => response.json())
    .then(result => response.send(result))
    .catch(error => response.send({errors: error}));
  };
});





