const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');

router.post('/crearGym', gymController.crearGym);

module.exports = router;