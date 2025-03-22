const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

router.post('/crear', entrenadorController.crearEntrenador);
router.post('/por-gym', entrenadorController.obtenerPorGym);

module.exports = router;