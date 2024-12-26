const mongoose  = require('mongoose');
const doctorsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
    },
},{timestamps:true});

const doctorsModel = mongoose.model('DoctorrsRegistrationInfo',doctorsSchema);
module.exports = doctorsModel;