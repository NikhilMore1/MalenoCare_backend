const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    DOB:{
        type:String,
        required:true
    }
},{timestamps:true});

const userRegistrationModel = mongoose.model('UserRegistrationInfo',userRegistrationSchema);
module.exports = userRegistrationModel;