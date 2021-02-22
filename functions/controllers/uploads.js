const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({origin: true});
const functions = require("firebase-functions");
const storage = new Storage({
    keyFilename: './serviceAccountKey.json'
});

exports.uploadFile = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if ( request.method !== "POST") {
            response.send(405).end();
        }

        const busboy = new Busboy({headers: request.headers});
        
        const fields =  parseFields(busboy);
        const files = parseFiles(busboy);
        saveFileToStorage(fields, files, busboy, response);
        busboy.end(request.rawBody);
    })
})

const parseFields = (busboy) => {

    const fields = {};

    busboy.on('field', (fieldname, val) => {
        console.log(`processed field true ${fieldname}: ${val}`);
        fields[fieldname] = val;
    });

    return fields
}

const parseFiles = (busboy) => {
    
    const tmpdir = os.tmpdir();
    const uploads = {};
    const fileWrites = [];
    let mimeType;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        console.log(`processed file ${filename}`);
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
    return {
        fileWrites: fileWrites,
        uploads: uploads,
        mimeType: mimeType
    }
}

const saveFileToStorage = (fields, files, busboy, response) => {
    busboy.on('finish', async () => {
        await Promise.all(files.fileWrites)
        let image; 

        //only set up to receive one photo, works with current frontend setup
        for (const file in files.uploads) {
            image = files.uploads[file];
        }

        let userId = fields.userId;
        let folder = fields.folder;
       
        storage.bucket('dmveasy-a82ea.appspot.com').upload(image, {
            destination: `${folder}/${userId}`,
            metadata: {
                cacheControl: 'public, max-age=31536000',
                metadata: {
                    contentType: files.mimeType
                }
            },
        }).catch(error => console.error(error))
        
        response.send(JSON.stringify({message: "Upload Processing`"}))
    })
}

//this sends back a signedURL of the image
exports.getFile = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        const folder = request.body.folder;
        const userId = request.body.userId;
        const options = {
            version: 'v4',                            
            action: 'read',                           
            expires: Date.now() + 60 * 60 * 1000,     
        };

        if ( userId && folder ) {
            const [url] = await storage
                .bucket('dmveasy-a82ea.appspot.com')                   
                .file(`${folder}/${userId}`)              
                .getSignedUrl(options)                    
                .catch(error => console.error(error));

            response.send(url);
        } else {
            response.send({error: "You are missing either the userId or folder type, try again!"});
        };
    });
})