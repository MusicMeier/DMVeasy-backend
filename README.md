# DMVeasy-api

DMVeasy api is a node server set up to allow data transfer to Anvils API in order to generate a PDF based off the data sent from the frontend. Also acts as the 
middle man for creating all of our cloud functions for Firebase.

# Table Of Contents 
- [Description](https://github.com/MusicMeier/DMVeasy-backend#description)
- [Example Code](https://github.com/MusicMeier/DMVeasy-backend#example-code)
- [Technology Used](https://github.com/MusicMeier/DMVeasy-backend#technology-used)
- [Setting up for the Application](https://github.com/MusicMeier/DMVeasy-backend#setting-up-to-run-locally)
- [Main Features](https://github.com/MusicMeier/DMVeasy-backend#main-features)
- [Features in Progress](https://github.com/MusicMeier/DMVeasy-backend#features-in-progress)
- [Contact Information](https://github.com/MusicMeier/DMVeasy-backend#contact-information)
- [Link to Frontend Repo](https://github.com/MusicMeier/DMVeasy-backend#link-to-frontend-repo)

## Description

This API is fullfilling all the needs of saving the documentation needed in order to renew a drivers license. This was intended to be a serverless database but we needed the node server in order to run our request to Anvils API to generate PDFs. There is one express route setup to receive all the information that goes into the PDF then send that data to Anvil, which returns raw binary. The server then is able to take the raw binary and upload it as a PDF to Firebase Storage.

The other functionality written into the codebase mostly sets up the Cloud functions. With these functions you can upload and get images from Firebase Storage. You can also signin/up users through Firebase Authentication. Finally you can update the users collection in the Firestore to keep track of any additional information about a specific user that you need.

## Example Code 
 This function allows you to dynamically update a user in the users collection as needed. 
```
  exports.updateUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const userId = request.body.userId;
        
        const userInformation = {};

        for ( let info in request.body ) {
            if ( info !== "userId") {
                userInformation[info] = request.body[info];
            };
        };

        let userRef = db.collection('users').doc(userId);
        if ( userRef ) {
            userRef.update(userInformation);
        } else {
            response.send("User not found");
        };

        response.send("User updated");
    });
});
```

## Technology Used

- Nodejs
- Firebase Storage
- Firestore
- Firebase Auth
- Cloud Functions

## Setting up to run locally

run `npm install`

then to start the node server with nodemon `npm start`

then run `firebase serve` to start the firebase server

## Main Features

- Holds functionality for cloud functions
- Upload files to Firebase Storage
- Authenticate users through Firebase Auth
- Store user data in Firestore
- Route set up to handle talking with Anvil API in order to generate filled PDFs

## Features in Progress

- Deploying all cloud functions
- 

## Contact Information

[Tiffany Kanjanabout](https://www.linkedin.com/in/tiffany-kanjanabout). (space, space)
[Junior Medina](https://www.linkedin.com/in/jrmedina1412/)
[Music Meier](https://www.linkedin.com/in/musicmeier/)
[Kyle Trahan](https://www.linkedin.com/in/kyletrahan/)

## Link to Frontend Repo
https://github.com/sydneygold/dmveasy-frontend


