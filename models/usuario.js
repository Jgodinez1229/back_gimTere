const pool = require('../db');

exports.crearUsuario = async ({ nombre, correo, contrasena, rol }) => {
  const consulta = `
    INSERT INTO usuarios (nombre, correo, contrasena, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const valores = [nombre, correo, contrasena, rol];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};