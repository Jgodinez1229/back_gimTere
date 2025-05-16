const Video = require("../models/videos");

exports.publicarVideo = async (req, res) => {
  const { id_entrenador, categoria, url } = req.body;
  if (!id_entrenador || !categoria || !url) {
    return res.status(400).json({ exito: false, mensaje: "Datos incompletos" });
  }
  try {
    const video = await Video.publicarVideo({ id_entrenador, categoria, url });
    res
      .status(201)
      .json({ exito: true, mensaje: "Video publicado", datos: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: "Error al publicar video" });
  }
};

exports.obtenerVideosPorEntrenador = async (req, res) => {
  const { id_entrenador } = req.params;
  try {
    const videos = await Video.obtenerVideosPorEntrenador(id_entrenador);
    res.json({ exito: true, datos: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: "Error al obtener videos" });
  }
};

exports.eliminarVideo = async (req, res) => {
  const { id_video, id_entrenador } = req.body;
  if (!id_video || !id_entrenador) {
    return res.status(400).json({ exito: false, mensaje: "Datos incompletos" });
  }
  try {
    const eliminado = await Video.eliminarVideo(id_video, id_entrenador);
    if (!eliminado) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Video no encontrado o no autorizado" });
    }
    res.json({ exito: true, mensaje: "Video eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: "Error al eliminar video" });
  }
};

exports.obtenerTodosLosVideos = async (req, res) => {
  try {
    const videos = await Video.obtenerTodosLosVideos();
    res.json({ exito: true, datos: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ exito: false, mensaje: "Error al obtener videos" });
  }
};
