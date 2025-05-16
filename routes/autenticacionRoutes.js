const express = require("express");
const router = express.Router();
const authController = require("../controllers/autenticacionController");

router.post("/login", authController.iniciarSesion);
router.post('/verificar-token', authController.verificarToken);

module.exports = router;
