const Solicitudes = require("../models/solicitudesEntrenador");
const pool = require("../db");

// Entrenador solicita acceso
exports.solicitarUnirseAGimnasio = async (req, res) => {
  const { id_entrenador, id_gimnasio } = req.body;

  if (!id_entrenador || !id_gimnasio) {
    return res.status(400).json({ exito: false, mensaje: "Datos incompletos" });
  }

  try {
    // Verificar si ya existe una solicitud pendiente o no rechazada
    const existe = await pool.query(
      `SELECT * FROM solicitudes_entrenador 
       WHERE id_entrenador = $1 AND id_gimnasio = $2 AND estado != 'rechazada'`,
      [id_entrenador, id_gimnasio]
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({
        exito: false,
        mensaje:
          "Ya existe una solicitud pendiente o aceptada para este gimnasio",
      });
    }

    const solicitud = await Solicitudes.crearSolicitud(
      id_entrenador,
      id_gimnasio
    );
    res.json({ exito: true, mensaje: "Solicitud enviada", datos: solicitud });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error al enviar solicitud" });
  }
};

// Admin ve solicitudes pendientes
exports.verSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Solicitudes.obtenerSolicitudesPendientes();
    res.json({ exito: true, datos: solicitudes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error al obtener solicitudes" });
  }
};

// Admin aprueba o rechaza solicitud
exports.responderSolicitud = async (req, res) => {
  const { id_solicitud, estado } = req.body;

  if (!["aceptada", "rechazada"].includes(estado)) {
    return res.status(400).json({ exito: false, mensaje: "Estado inválido" });
  }

  try {
    // Obtener la solicitud y datos del entrenador
    const solicitudActualizada = await Solicitudes.actualizarEstadoSolicitud(
      id_solicitud,
      estado
    );

    // Obtener datos del entrenador
    const entrenadorRes = await pool.query(
      `SELECT id_entrenador, id_gimnasio FROM entrenadores WHERE id_entrenador = $1`,
      [solicitudActualizada.id_entrenador]
    );
    const entrenador = entrenadorRes.rows[0];

    if (estado === "aceptada") {
      // Verificar si el entrenador ya pertenece a un gimnasio
      if (entrenador.id_gimnasio) {
        // Ya pertenece a un gimnasio, rechazar esta solicitud
        await Solicitudes.actualizarEstadoSolicitud(id_solicitud, "rechazada");
        return res.status(409).json({
          exito: false,
          mensaje:
            "El entrenador ya pertenece a un gimnasio. Solicitud rechazada automáticamente.",
        });
      }

      // Asignar el gimnasio al entrenador
      await pool.query(
        `UPDATE entrenadores SET id_gimnasio = $1 WHERE id_entrenador = $2`,
        [solicitudActualizada.id_gimnasio, solicitudActualizada.id_entrenador]
      );

      // Rechazar automáticamente otras solicitudes pendientes de ese entrenador
      await pool.query(
        `UPDATE solicitudes_entrenador 
         SET estado = 'rechazada' 
         WHERE id_entrenador = $1 
         AND estado = 'pendiente' 
         AND id_solicitud != $2`,
        [solicitudActualizada.id_entrenador, id_solicitud]
      );
    }

    res.json({
      exito: true,
      mensaje: `Solicitud ${estado}`,
      datos: solicitudActualizada,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error al actualizar solicitud" });
  }
};
