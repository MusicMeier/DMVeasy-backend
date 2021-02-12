const functions = require("firebase-functions");
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const { db } = require('../utilities/admin');

exports.signUpWithEmailPassword = functions.https.onRequest((request,response) =>{
    cors(request, response, () => {
        const newUser = {
            id: request.body.uid,
            email: request.body.email,
            password: request.body.password,
        };

        let userId;
        
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
            userId = data.user.uid;
            createUser(userId, newUser.email);
            return data.user.getIdToken();
            })
        .then((token) => {
            response.send({token: token, userId: userId});
        }).catch((error) => {
            response.send({errors: error});
        });
    });
});

//inserts the user into the users collection upon auth creation
const createUser = (id, email) => {
    
    const newUser = {
        userInformation: {
            email: email
        }
    };

    db.collection('users').doc(id).set(newUser);
}

exports.signInUserWithPasswordAndEmail = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = {
            email: request.body.email,
            password: request.body.password,
        };

        let userId; 

        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            response.send({token: token, userId: userId});
        })
        .catch((error) => {
            response.send({errors: error});
        });
    });
})

//find the user from the collections based off the id from the person that is logged in
exports.getUser = functions.https.onRequest((request, response) => { 
    cors(request, response, () => { 
        
        const userId = request.body.userId;

        const userRef = db.collection('users').doc(userId);
        userRef.get()
        .then(snapshot => {
            if (snapshot.exists) {
                response.send(snapshot.data())
            } else {
                response.send("User not found")
            }
        }).catch(error => response.send({errors: error}));
    });
})

//will update whatever field you send in the request to a specific user
exports.updateUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const userId = request.body.userId;
        
        const userInformation = {}

        for ( let info in request.body ) {
            if ( info !== "userId") {
                userInformation[info] = request.body[info]
            }
        }

        let userRef = db.collection('users').doc(userId)
        if ( userRef ) {
            userRef.update(userInformation)
        } else {
            response.send("User not found")
        }

        response.send("User updated, let me know if you want the userinfo here")
    })
})
