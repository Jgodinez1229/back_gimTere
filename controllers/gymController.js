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
