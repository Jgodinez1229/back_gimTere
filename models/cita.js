const pool = require("../db");

//Crear una cita
exports.crearCita = async ({ id_usuario, id_entrenador, fecha_hora }) => {
  const consulta = `
    INSERT INTO citas (id_usuario, id_entrenador, fecha_hora)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

  const valores = [id_usuario, id_entrenador, fecha_hora];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

//Actualizar el estado de la cita
exports.actualizarEstadoCita = async (id_cita, estado, id_entrenador) => {
  const consulta = `
    UPDATE citas
    SET estado = $1
    WHERE id_cita = $2 AND id_entrenador = $3
    RETURNING *
    `;

  const valores = [estado, id_cita, id_entrenador];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

//Obtener citas por usuario
exports.obtenerCitasUsuario = async (id_usuario) => {
  const consulta = `
      SELECT 
        c.*,
        e.nombre as nombre_entrenador,
        e.foto as foto_entrenador,
        e.telefono as telefono_entrenador,
        e.costo_sesion,
        e.costo_mensual,
        g.nombre as nombre_gimnasio,
        g.direccion as direccion_gimnasio
      FROM citas c
      JOIN entrenadores e ON c.id_entrenador = e.id_entrenador
      JOIN gimnasios g ON e.id_gimnasio = g.id_gimnasio
      WHERE c.id_usuario = $1
      ORDER BY c.fecha_hora DESC
    `;
  const resultado = await pool.query(consulta, [id_usuario]);
  return resultado.rows;
};

//Obtener citas por entrenador
exports.obtenerCitasEntrenador = async (id_entrenador) => {
  const consulta = `
      SELECT 
        c.*,
        u.nombre as nombre_usuario,
        u.correo as correo_usuario,
        u.rol as rol_usuario
      FROM citas c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_entrenador = $1
      ORDER BY c.fecha_hora DESC
    `;
  const resultado = await pool.query(consulta, [id_entrenador]);
  return resultado.rows;
};

// Cancelar cita (para clientes)
exports.cancelarCitaCliente = async (id_cita, id_usuario) => {
  const consulta = `
    UPDATE citas
    SET estado = 'cancelada',
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_cita = $1 AND id_usuario = $2
    RETURNING *
  `;
  const valores = [id_cita, id_usuario];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};
