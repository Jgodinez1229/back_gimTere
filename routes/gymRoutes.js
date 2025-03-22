const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');

router.post('/crearGym', gymController.crearGym);
router.put('/actualizar', gymController.actualizarGym);
router.get('/listar', gymController.obtenerGyms);
router.delete('/eliminar', gymController.eliminarGym);


module.exports = router;