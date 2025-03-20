const express = require("express");
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');

router.post("/registrar", usuarioController.registrarUsuario);

module.exports = router;
