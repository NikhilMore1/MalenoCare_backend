
const regModel = require('../models/userRegistration.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const register = async (req, res) => {
    try {
        const { name, email,password,mobile, DOB } = req.body;

        // Check if user already exists
        const existingUser = await regModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // const result = await cloudinary.uploader.upload(req.file.path);
        // fs.unlinkSync(req.file.path);

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new regModel({
            name,
            email,
            password:hashedPassword,
            mobile,
            DOB
        });

        const resp = await newUser.save();

        res.status(201).send({
            message: 'User created',
            user: resp, 
        });
        console.log(resp);
    } catch (error) {
        console.error('Error during registration:', error);
        if (!res.headersSent) {
            return res.status(500).send({ error: 'An error occurred during registration' });
        }
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find user by username only
        const user = await regModel.findOne({ name });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Send response with token and role
        res.json({ token, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = {
    register,
    loginUser
}
 