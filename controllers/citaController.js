const Cita = require("../models/cita");

// Crear cita (para usuarios)
exports.crearCita = async (req, res) => {
  const { id_usuario, id_entrenador, fecha_hora } = req.body;
  //const id_usuario = req.usuario.id_usuario;

  if (!id_usuario || !id_entrenador || !fecha_hora) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El id del entrenador y la fecha/hora son obligatorios",
    });
  }

  try {
    const cita = await Cita.crearCita({
      id_usuario,
      id_entrenador,
      fecha_hora,
    });

    res.status(201).json({
      exito: true,
      mensaje: "Cita agendada exitosamente",
      datos: cita,
    });
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al crear la cita",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

// Actualizar estado de cita (para entrenadores)
exports.actualizarEstadoCita = async (req, res) => {
  const { id_entrenador, id_cita, estado } = req.body;
  //const id_entrenador = req.usuario.id_entrenador; // Asume middleware de autenticación

  if (!id_entrenador || !id_cita || !estado) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El id de la cita y el estado son obligatorios",
    });
  }

  if (!["confirmada", "cancelada"].includes(estado)) {
    return res.status(400).json({
      exito: false,
      mensaje: "Estado inválido",
      detalles: "El estado debe ser 'confirmada' o 'cancelada'",
    });
  }

  try {
    const cita = await Cita.actualizarEstadoCita(
      id_cita,
      estado,
      id_entrenador
    );

    if (!cita) {
      return res.status(404).json({
        exito: false,
        mensaje: "Cita no encontrada",
        detalles: "La cita no existe o no pertenece a este entrenador",
      });
    }

    res.json({
      exito: true,
      mensaje: `Cita ${estado} exitosamente`,
      datos: cita,
    });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar la cita",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

// Obtener citas (según el rol)
exports.obtenerCitas = async (req, res) => {
  const { rol, id_usuario, id_entrenador } = req.body;

  if (
    !rol ||
    (rol === "cliente" && !id_usuario) ||
    (rol === "entrenador" && !id_entrenador)
  ) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "Debe especificar el rol y el ID correspondiente",
    });
  }

  try {
    let citas;
    if (rol === "cliente") {
      citas = await Cita.obtenerCitasUsuario(id_usuario);
    } else if (rol === "entrenador") {
      citas = await Cita.obtenerCitasEntrenador(id_entrenador);
    } else {
      return res.status(400).json({
        exito: false,
        mensaje: "Rol inválido",
        detalles: "El rol debe ser 'cliente' o 'entrenador'",
      });
    }

    res.json({
      exito: true,
      mensaje: "Citas obtenidas exitosamente",
      datos: citas,
    });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener las citas",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};
