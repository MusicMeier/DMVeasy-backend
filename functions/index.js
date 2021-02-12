const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');
const { 
    signInUserWithPasswordAndEmail, 
    signUpWithEmailPassword, 
    getUser,
    updateUser,
    signOut 
} = require('./controllers/auth');
const bodyParser = require('body-parser');

firebase.initializeApp(firebaseConfig);

//probably dont need
app.use(bodyParser.json());

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;
exports.updateUser = updateUser;
// exports.signOut = signOut;

const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

exports.upload = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        let userId = request.body.userId
        let folder = request.body.folder
        let image = request.body.image
        
        storage.bucket('dmveasy-a82ea.appspot.com/').upload(image, {
        destination: `${folder}/${userId}`,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
        response.send("File uploaded")
    })
})






