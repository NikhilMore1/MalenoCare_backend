
const express = require('express');
const { register, loginUser, getAllUsers, getUserNameById } = require('../controllers/userRegistration.controllers');
const router = express.Router();

router.post('/',register);
router.post('/login',loginUser);
router.get('/',getAllUsers)
router.get('/:id',getUserNameById)
module.exports = router;
