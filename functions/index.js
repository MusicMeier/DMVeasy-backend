const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');
const serviceAccountKey = require('../serviceAccountKey.json')
const {
    signInUserWithPasswordAndEmail, 
    signUpWithEmailPassword, 
    getUser,
    updateUser,
    signOut 
} = require('./controllers/auth');
// const bodyParser = require('body-parser');   

firebase.initializeApp(firebaseConfig);

//probably dont need
// app.use(bodyParser.json());

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;
exports.updateUser = updateUser;
// exports.signOut = signOut;

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: "dmveasy-a82ea",
    keyFilename: serviceAccountKey
});

const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

exports.uploadImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if ( request.method !== "POST") {
            response.send(405).end();
        }

        const busboy = new Busboy({headers: request.headers})
        const tmpdir = os.tmpdir()

        const fields = {}

        const uploads = {};

        busboy.on('field', (fieldname, val) => {
            console.log(`processed field ${fieldname}: ${val}`)
            fields[fieldname] = val;
        })

        const fileWrites = []
        let mimeType = ""
        busboy.on('file', (fieldname, file, filename, mimetype) => {
            console.log(`processed file ${filename}`)
            mimeType = mimetype
            const filepath = path.join(tmpdir, filename)
            uploads[fieldname] = filepath
            const writeStream = fs.createWriteStream(filepath)
            file.pipe(writeStream)

            const promise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    writeStream.end()
                })
                writeStream.on('finish', resolve)
                writeStream.on('error', reject)
            })
            fileWrites.push(promise)
        })

        busboy.on('finish', async () => {
            await Promise.all(fileWrites)
            
            let image 

            for (const file in uploads) {
                image = uploads[file]
                
                fs.unlinkSync(uploads[file])
            }

            let userId = fields.userId
            let folder = fields.folder
            
            storage.bucket('dmveasy-a82ea.appspot.com/').upload(image, {
                destination: `${folder}/${userId}`,
                metadata: {
                    contentType: mimeType,
                    cacheControl: 'public, max-age=31536000',
                },
            }).catch(error => console.error(error));
            response.send();
        })
        busboy.end(request.rawBody)

    })
})






