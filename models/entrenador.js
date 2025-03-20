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
