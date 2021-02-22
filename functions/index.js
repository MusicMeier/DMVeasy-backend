//file that firebase deploy looks for cloud functions

const { 
    signInUserWithPasswordAndEmail, 
    signUpWithEmailPassword, 
    getUser,
    updateUser
} = require('./controllers/auth');
const {
    uploadImage,
    getImage
} = require('./controllers/uploads')

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.uploadImage = uploadImage;
exports.getImage = getImage;
















