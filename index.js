const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser'); 
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config');
const cloudinary = require('cloudinary').v2;

const cloudinaryName = 'dkfakg7mw';
const cloudinaryKey = '472725881526577'
const cloudinarySecret = 'j5oQTkwakGjAq8jLCcDGiO2s7jM';

cloudinary.config({ 
    cloud_name:cloudinaryName,
    api_key:cloudinaryKey,  
    api_secret:cloudinarySecret
});
app.use(express.json()); 
app.use('/uploads',express.static('uploads')); 
app.use(cors());  
connectDb().then(() => {  
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


    app.use('/api/users',require('./routes/userRegistration.routes'));
    app.use('/api/chat/doctorsRegistration',require('./routes/Chat/doctorsRegistration.routes'));
    app.listen(process.env.PORT, () => {
        console.log(`Server running on process.env.PORT ${process.env.PORT}`);
    });       
}).catch(error => { 
    console.error("Failed to connect to MongoDB:", error);
});      