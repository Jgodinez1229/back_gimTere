const express = require("express");
const router = express.Router();
const entrenadorController = require("../controllers/entrenadorController");

router.post("/crear", entrenadorController.crearEntrenador);
router.post("/por-gym", entrenadorController.obtenerPorGym);
router.get("/:id_entrenador", entrenadorController.obtenerPorId);
router.post("/baja-gym", entrenadorController.darseDeBajaDelGym);

module.exports = router;
