const express = require('express');
const changePasswordModel = require('../models/ChangePassword.models');
const bcrypt = require('bcrypt');


const ChangeMyPass = async (req,res)=>{
    try{
        const {existingPassword,newPassword} = req.body;
        const user = await changePasswordModel.findById(req.userId);
        if(!user){
            return res.status(404).send({message:'User not found'});

    const isMatch = await bcrypt.compare(existingPassword,user.password);
    if(!isMatch){
      return res.status(400).json({message:'Invalid Password try again '}); 

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword,salt);
        

        user.password = hashPassword;
        await user.save();

        res.status(201).send({message:'Password changed successfully'});
        }
        }
    }catch(error){
        res.status(500).send('Server error , Please try again');
    }
}

module.exports = ChangeMyPass;