const functions = require("firebase-functions");
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const { db } = require('../utilities/admin')

exports.signUpWithEmailPassword = functions.https.onRequest((request,response) =>{
    cors(request, response, () => {
        const newUser = {
            id: request.body.uid,
            email: request.body.email,
            password: request.body.password,
        };

        let userid;
        
        db.doc(`/users/${newUser.id}`).get()
        .then((doc) => {
            console.log(doc)
            if(doc.exists) {
                return response.json({ message: 'this user has been created' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            console.log(data, "data")
            userid = data.user.uid;
            return data.user.getIdToken();
            })
        .then((token) => {
            response.send({token: token, userId: userid});
        }).catch((error) => {
            response.send({errors: error});
        });
    });
});

exports.signInUserWithPasswordAndEmail = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = {
            email: request.body.email,
            password: request.body.password,
        }
        let userId; 
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            response.send({token: token, userId: userId});
            firebase.auth().onAuthStateChanged( (user) => {
                if (user) {
                    console.log("hey")
                } else {
                    console.log("loser")
                }
            })
        })
        .catch((error) => {
            response.send({errors: error});
        })
    })
})

exports.getUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        console.log("hey")
        firebase.auth().getUserByEmail(request.body.email)
        .then((userRecord) => {
            console.log(userRecord)
        })
    })
})