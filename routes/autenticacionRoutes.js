const express = require("express");
const router = express.Router();
const authController = require("../controllers/autenticacionController");

router.post("/login", authController.iniciarSesion);

module.exports = router;
