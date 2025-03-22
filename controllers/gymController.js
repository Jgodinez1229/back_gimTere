const Gimnasio = require("../models/gym");

exports.crearGym = async (req, res) => {
  const { nombre, direccion, hora_entrada, hora_salida, descripcion } =
    req.body;

  if (!nombre || !direccion || !hora_entrada || !hora_salida || !descripcion) {
    return res.status(400).json({
      exito: false,
      mensaje: "Todos los campos son requeridos",
      detalles:
        "Nombre, dirección, hora de entrada y hora de salida son obligatorios",
    });
  }

  try {
    const gimnasio = await Gimnasio.crearGym({
      nombre,
      direccion,
      hora_entrada,
      hora_salida,
      descripcion,
    });

    res.status(201).json({
      exito: true,
      mensaje: "Gimnasio creado correctamente",
      detalles: gimnasio,
    });
  } catch (error) {
    console - error("Error al crear el gym", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al crear el gimnasio",
      detalles: "Ocurrio un error interno del servidor",
    });
  }
};

//Actualizar gym
exports.actualizarGym = async (req, res) => {
  const {
    id_gimnasio,
    nombre,
    direccion,
    hora_entrada,
    hora_salida,
    descripcion,
  } = req.body;

  if (!id_gimnasio) {
    return res.status(400).json({
      exito: false,
      mensaje: "ID requerido",
      detalles: "El ID del gimnasio es obligatorio",
    });
  }

  if (!nombre || !direccion || !hora_entrada || !hora_salida || !descripcion) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "Todos los campos son obligatorios",
    });
  }

  try {
    const gimnasio = await Gimnasio.actualizarGym(id_gimnasio, {
      nombre,
      direccion,
      hora_entrada,
      hora_salida,
      descripcion,
    });

    if (!gimnasio) {
      return res.status(404).json({
        exito: false,
        mensaje: "Gimnasio no encontrado",
        detalles: "El gimnasio que intenta actualizar no existe",
      });
    }

    res.json({
      exito: true,
      mensaje: "Gimnasio actualizado correctamente",
      datos: gimnasio,
    });
  } catch (error) {
    console.error("Error al actualizar el gimnasio:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar el gimnasio",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

exports.obtenerGyms = async (req, res) => {
  try {
    const gimnasios = await Gimnasio.obtenerGyms();

    res.json({
      exito: true,
      mensaje: "Gimnasios obtenidos correctamente",
      datos: gimnasios,
    });
  } catch (error) {
    console.error("Error al obtener gimnasios:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener los gimnasios",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

//Eliminar gym
exports.eliminarGym = async (req, res) => {
  const { id_gimnasio } = req.body;

  if (!id_gimnasio) {
    return res.status(400).json({
      exito: false,
      mensaje: "ID requerido",
      detalles: "El ID del gimnasio es obligatorio"
    });
  }

  try {
    const gimnasioEliminado = await Gimnasio.eliminarGym(id_gimnasio);

    if (!gimnasioEliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: "Gimnasio no encontrado",
        detalles: "El gimnasio que intenta eliminar no existe"
      });
    }

    res.json({
      exito: true,
      mensaje: "Gimnasio eliminado correctamente",
      detalles: "Los entrenadores han sido desvinculados del gimnasio",
      datos: gimnasioEliminado
    });

  } catch (error) {
    console.error("Error al eliminar el gimnasio:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar el gimnasio",
      detalles: "Ocurrió un error interno del servidor"
    });
  }
};
