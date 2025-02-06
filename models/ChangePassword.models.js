const mongoose = require('mongoose');
const changePassword = new mongoose.Schema({
    password :{
        type:String,
        required:true
    }
},{timestamps:true});

const changePasswordModel = mongoose.model('ChangedPassword', changePassword);

module.exports = changePasswordModel;

