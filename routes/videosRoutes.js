const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosController");

router.post("/publicar", videoController.publicarVideo);
router.get(
  "/entrenador/:id_entrenador",
  videoController.obtenerVideosPorEntrenador
);
router.delete("/eliminar", videoController.eliminarVideo);

router.get("/todos", videoController.obtenerTodosLosVideos);

module.exports = router;
