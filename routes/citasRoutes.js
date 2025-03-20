const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citaController");

// Rutas para usuarios
router.post("/crear", citasController.crearCita);
router.get("/mis-citas", citasController.obtenerCitas);

// Rutas para entrenadores
router.put("/actualizar-estado", citasController.actualizarEstadoCita);

module.exports = router;