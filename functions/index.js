const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors')({origin: true});
const firebase = require('firebase');
const firebaseConfig = require('./utilities/firebaseConfig');
const { 
    signInUserWithPasswordAndEmail, 
    signUpWithEmailPassword, 
    getUser,
    updateUser
} = require('./controllers/auth');

const bodyParser = require('body-parser');

const path = require('path');
const os = require('os');
const fs = require('fs');

const Busboy = require('busboy');

firebase.initializeApp(firebaseConfig);

//probably dont need 
app.use(bodyParser.json());

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;
exports.updateUser = updateUser;

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    keyFilename: '../serviceAccountKey.json'
});

exports.uploadImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if ( request.method !== "POST") {
            response.send(405).end();
        }
        const busboy = new Busboy({headers: request.headers});
        const tmpdir = os.tmpdir();
        const fields = {};
        const uploads = {};
        
        busboy.on('field', (fieldname, val) => {
            console.log(`processed field true ${fieldname}: ${val}`);
            fields[fieldname] = val;
        });
        
        const fileWrites = [];
        let mimeType;

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            
            console.log(`processed file ${filename}`)
            const filepath = path.join(tmpdir, filename);
            mimeType = mimetype;

            uploads[fieldname] = filepath;
            const writeStream = fs.createWriteStream(filepath);
            
            file.pipe(writeStream);
            const promise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    writeStream.end();
                });
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            fileWrites.push(promise);
        });
        
        busboy.on('finish', async () => {
            await Promise.all(fileWrites)
            let image; 
            
            for (const file in uploads) {
                image = uploads[file];
            }

            let userId = fields.userId;
            let folder = fields.folder;
           
            storage.bucket('dmveasy-a82ea.appspot.com').upload(image, {
                destination: `${folder}/${userId}`,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                    metadata: {
                        contentType: mimeType
                    }
                },
            }).catch(error => response.send(JSON.stringify({errors: error})));

            response.send(JSON.stringify({message: "Image Uploaded"}))
        })
        busboy.end(request.rawBody);
    })
})

//this sends back a signedURL of the image
exports.getImage = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const folder = request.body.folder;
        const userId = request.body.userId;
        const options = {
            version: 'v4',                            
            action: 'read',                           
            expires: Date.now() + 1000 * 60 * 60,     
        };
          
        const [url] = await storage
            .bucket('dmveasy-a82ea.appspot.com')                   
            .file(`${folder}/${userId}`)              
            .getSignedUrl(options)                    
            .catch(console.error);

        response.send(url);
    });
})










