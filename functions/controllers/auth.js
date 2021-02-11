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
        let currentUser;

        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            currentUser = userCredential.user
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            response.send({token: token, userId: userId, currentUser: currentUser});
        })
        .catch((error) => {
            response.send({errors: error});
        })
    })
})


exports.signOut = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        firebase.auth().signOut().then( () => {
            response.send("signout successful")
        }).catch(error => response.send(error))
    })
})