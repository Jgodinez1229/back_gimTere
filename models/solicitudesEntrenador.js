const pool = require("../db");

exports.crearSolicitud = async (id_entrenador, id_gimnasio) => {
  const consulta = `
    INSERT INTO solicitudes_entrenador (id_entrenador, id_gimnasio)
    VALUES ($1, $2)
    RETURNING *
  `;
  const resultado = await pool.query(consulta, [id_entrenador, id_gimnasio]);
  return resultado.rows[0];
};

exports.obtenerSolicitudesPendientes = async () => {
  const consulta = `
    SELECT s.*, e.nombre AS nombre_entrenador, g.nombre AS nombre_gimnasio
    FROM solicitudes_entrenador s
    JOIN entrenadores e ON s.id_entrenador = e.id_entrenador
    JOIN gimnasios g ON s.id_gimnasio = g.id_gimnasio
    WHERE s.estado = 'pendiente'
  `;
  const resultado = await pool.query(consulta);
  return resultado.rows;
};

exports.actualizarEstadoSolicitud = async (id_solicitud, estado) => {
  const consulta = `
    UPDATE solicitudes_entrenador
    SET estado = $1
    WHERE id_solicitud = $2
    RETURNING *
  `;
  const resultado = await pool.query(consulta, [estado, id_solicitud]);
  return resultado.rows[0];
};
