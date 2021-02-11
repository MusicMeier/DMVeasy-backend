const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');
const { signInUserWithPasswordAndEmail, signUpWithEmailPassword, getUser } = require('./controllers/auth');
const bodyParser = require('body-parser');

firebase.initializeApp(firebaseConfig);

//probably dont need
app.use(bodyParser.json());

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;







