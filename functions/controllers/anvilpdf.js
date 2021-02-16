const fs = require('fs');
const Anvil = require('@anvilco/anvil');
const pdfTemplateID = '2H1hdiXvYLA1abriziAV'; 
const apiKey = 'Wx80argqSv0H9JwdXERZXswx32AW6GAR';
const renewalFormData = {
    "title": "DMV License Renewal",
    "fontSize": 10,
    "textColor": "#333333",
    "data": {
    "ApplicantName": {
        "firstName": "Robin",
        "mi": "W",
        "lastName": "Smith"
    },
    "Suffix": "Suffix",
    "ApplicantHeight": 12345,
    "ApplicantWeight": 12345,
    "ApplicantHairColor": "Hair",
    "ApplicantEyeColor": "Eye",
    "DLIDNumber": "A5GD5dI9B",
    "DOBMonth": 12345,
    "no": true,
    "yes": true,
    "COAddress": {
        "street1": "123 Main St #234",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94106",
        "country": "US"
    },
    "COMailing": {
        "street1": "123 Main St #234",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94106",
        "country": "US"
    },
    "Name": {
        "firstName": "Robin",
        "mi": "W",
        "lastName": "Smith"
    },
    "licenseNumber": 12345,
    "DOE": "2021-02-13",
    "DateToday": "2021-02-13",
    "OptometristLicenseNumber": 12345,
    "OptometristName": "Optometrist/Ophthalmologist (Please Print Name)",
    "OptometristTitle": "Title",
    "OptometristAddress": {
        "street1": "123 Main St #234",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94106",
        "country": "US"
    },
    "OptometristPhone": {
        "num": "5554443333",
        "region": "US",
        "baseRegion": "US"
    },
    "DrivingPrivilegeNo": true,
    "DrivingPrivilegeYes": true,
    "OtherStateNo": true,
    "OtherStateYes": true,
    "SafetyNo": true,
    "SafetyYes": true,
    "Required": true,
    "Not": true,
    "DOBDay": 12345,
    "DOBYear": 12345
    }
}
const anvilClient = new Anvil({ apiKey })
const {
    statusCode,
    data
} = await anvilClient.fillPDF(pdfTemplateID, renewalFormData)
console.log(statusCode) // 200
fs.writeFileSync('output.pdf', data, { encoding: null })