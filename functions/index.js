//file that firebase deploy looks for cloud functions

const { 
    signInUserWithPasswordAndEmail, 
    signUpWithEmailPassword, 
    getUser,
    updateUser
} = require('./controllers/auth');
const {
    uploadFile,
    getFile
} = require('./controllers/uploads')

exports.signUp = signUpWithEmailPassword;
exports.signIn = signInUserWithPasswordAndEmail;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.uploadFile = uploadFile;
exports.getFile = getFile;
















