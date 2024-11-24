
const express = require('express');
const { register, loginUser } = require('../controllers/userRegistration.controllers');
const router = express.Router();

router.post('/',register);
router.post('/login',loginUser);
module.exports = router;
