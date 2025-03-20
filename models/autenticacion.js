const pool = require("../db");

exports.buscarUsuarioPorCorreo = async (correo) => {
  // Primero buscamos en la tabla de usuarios
  const consultaUsuario = `
    SELECT *, 'cliente' as tipo FROM usuarios 
    WHERE correo = $1
  `;

  const resultadoUsuario = await pool.query(consultaUsuario, [correo]);
  if (resultadoUsuario.rows[0]) return resultadoUsuario.rows[0];

  // Si no está en usuarios, buscamos en entrenadores
  const consultaEntrenador = `
    SELECT *, 'entrenador' as tipo FROM entrenadores 
    WHERE correo = $1
  `;

  const resultadoEntrenador = await pool.query(consultaEntrenador, [correo]);
  return resultadoEntrenador.rows[0];
};
