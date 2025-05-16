const express = require("express");
const router = express.Router();
const SolicitudesController = require("../controllers/solicitudesEntrenadorController");

// Entrenador crea solicitud
router.post("/solicitar", SolicitudesController.solicitarUnirseAGimnasio);

// Admin obtiene solicitudes pendientes
router.get("/pendientes", SolicitudesController.verSolicitudesPendientes);

// Admin responde solicitud
router.put("/responder", SolicitudesController.responderSolicitud);

module.exports = router;
