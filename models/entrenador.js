const pool = require("../db");

exports.crearEntrenador = async ({
  id_gimnasio,
  nombre,
  correo,
  contrasena,
  foto,
  edad,
  costo_sesion,
  costo_mensual,
  telefono,
}) => {
  const consulta = `
    INSERT INTO entrenadores (
      id_gimnasio, 
      nombre, 
      correo, 
      contrasena, 
      foto, 
      edad, 
      costo_sesion, 
      costo_mensual, 
      telefono
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `;

  const valores = [
    id_gimnasio,
    nombre,
    correo,
    contrasena,
    foto,
    edad,
    costo_sesion,
    costo_mensual,
    telefono,
  ];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

exports.buscarPorCorreo = async (correo) => {
  const consulta = `SELECT * FROM entrenadores WHERE correo = $1`;
  const resultado = await pool.query(consulta, [correo]);
  return resultado.rows[0];
};

//Obtener entrenador por gym
exports.obtenerPorGym = async (id_gimnasio) => {
  const consulta = `
      SELECT 
      e.id_entrenador,
      e.nombre,
      e.foto,
      e.edad,
      e.costo_sesion,
      e.costo_mensual,
      e.telefono,
      e.correo,
      g.nombre as nombre_gimnasio
    FROM entrenadores e
    JOIN gimnasios g ON e.id_gimnasio = g.id_gimnasio
    WHERE e.id_gimnasio = $1
    ORDER BY e.nombre ASC
  `;

  const resultado = await pool.query(consulta, [id_gimnasio]);
  return resultado.rows;
};

exports.obtenerPorId = async (id_entrenador) => {
  const consulta = `
    SELECT 
      e.id_entrenador,
      e.nombre,
      e.foto,
      e.edad,
      e.costo_sesion,
      e.costo_mensual,
      e.telefono,
      e.correo,
      e.id_gimnasio,
      g.nombre as nombre_gimnasio
    FROM entrenadores e
    LEFT JOIN gimnasios g ON e.id_gimnasio = g.id_gimnasio
    WHERE e.id_entrenador = $1
  `;
  const resultado = await pool.query(consulta, [id_entrenador]);
  return resultado.rows[0];
};

exports.darseDeBajaDelGym = async (id_entrenador) => {
  const consulta = `
    UPDATE entrenadores
    SET id_gimnasio = NULL,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id_entrenador = $1
    RETURNING *
  `;
  const resultado = await pool.query(consulta, [id_entrenador]);
  return resultado.rows[0];
};
