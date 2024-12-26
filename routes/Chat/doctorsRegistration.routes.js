const express = require('express');
const upload = require('../../Middleware/ImageUploades.middleware');
const {registerDoctors, getAllDoctorsName, getDoctorNameById} = require('../../controllers/Chat/doctorsRegistration.controllers');
const router = express.Router();
router.post('/',upload.single('profileImage'),registerDoctors);
router.get('/',getAllDoctorsName)
router.get('/:id',getDoctorNameById)
module.exports = router;