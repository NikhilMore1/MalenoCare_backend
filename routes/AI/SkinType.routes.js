const express = require('express');
const { getSkinType } = require('../../controllers/AI/SkinType.controllers');
const router = express.Router();
router.post('/Predict',getSkinType);
module.exports = router;