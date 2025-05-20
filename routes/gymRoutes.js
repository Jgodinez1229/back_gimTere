const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');

router.post('/crearGym', gymController.crearGym);
router.put('/actualizar', gymController.actualizarGym);
router.get('/listar', gymController.obtenerGyms);
router.delete('/eliminar/:id_gimnasio', gymController.eliminarGym);
router.get('/:id_gimnasio', gymController.obtenerGymPorId);


module.exports = router;