const express = require('express');
const ChangeMyPass = require('../controllers/ChangePassword.controllers');
const router = express.Router();


router.post('/',ChangeMyPass);

module.exports = router;
