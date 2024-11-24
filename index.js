const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser'); 
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config');
// mongoose.connect("mongodb://localhost:27017/Capstone" )   
// .then(()=>console.log("connection established..")) 
// .catch(err=>console.log(err));  
app.use(express.json()); 
app.use(cors());  
connectDb().then(() => {  
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


    app.use('/api/users',require('./routes/userRegistration.routes'));
    app.listen(process.env.PORT, () => {
        console.log(`Server running on process.env.PORT ${process.env.PORT}`);
    });       
}).catch(error => { 
    console.error("Failed to connect to MongoDB:", error);
});     