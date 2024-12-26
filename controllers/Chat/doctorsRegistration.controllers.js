const doctorsRegistrationModel = require('../../models/Chat/doctorsRegister.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;


const registerDoctors = async(req,res)=>{
    try{
        const {name,password,email,mobile,profileImage} = req.body;
        const filename = req.file.filename;
        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);
        res.status(201).send({
            message:'Image uploaded successfully',
            image_url:result.secure_url
        });
        const hashPassword = await bcrypt.hash(password,10);
        const newRegistrationModel = new doctorsRegistrationModel({
            name,
            password:hashPassword,
            email,
            mobile,
            profileImage:result.secure_url
        });
        const resp = await newRegistrationModel.save();
        res.status(201).send({
            message:'User created',
            responses:resp,
        });
        console.log(resp);
        
    }catch(error){
        console.log(error);
        res.status(500).send({error:'Server error',error});

        
    }
}

const getAllDoctorsName = async(req,res)=>{
    try{
        const resp = await doctorsRegistrationModel.find();
        res.status(200).send({Name:resp});
    }catch(error){
        console.log(error);
        res.status(500).send({error:'Server error',error});
    }
}

const getDoctorNameById = async(req,res)=>{
    try{
        const doctorId = req.params.id;
        const resp = await doctorsRegistrationModel.findById(doctorId);
        res.status(200).send({resp});

    }catch(error){
        console.log(error);
        res.status(500).send({error:'Server error',error});
        
    }
}

module.exports = {
    registerDoctors,
    getAllDoctorsName,
    getDoctorNameById
};
