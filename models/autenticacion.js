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

exports.guardarToken2FA = async (usuario, token, expiracion) => {
  // Determinar la tabla basada en el tipo de usuario
  const tabla = usuario.tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = usuario.tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';
  const id = usuario.tipo === 'entrenador' ? usuario.id_entrenador : usuario.id_usuario;

  const consulta = `
    UPDATE ${tabla}
    SET token_2fa = $1,
        token_2fa_expiracion = $2
    WHERE ${idColumn} = $3
    RETURNING *
  `;

  const resultado = await pool.query(consulta, [token, expiracion, id]);
  return resultado.rows[0];
};


exports.verificarToken2FA = async (id, token, tipo) => {
  const tabla = tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';

  const consulta = `
    SELECT * FROM ${tabla} 
    WHERE ${idColumn} = $1 
    AND token_2fa = $2 
    AND token_2fa_expiracion > NOW()
  `;

  const resultado = await pool.query(consulta, [id, token]);
  return resultado.rows[0];
};

exports.limpiarToken2FA = async (id, tipo) => {
  const tabla = tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';

  const consulta = `
    UPDATE ${tabla} 
    SET token_2fa = NULL, 
        token_2fa_expiracion = NULL
    WHERE ${idColumn} = $1
  `;

  await pool.query(consulta, [id]);
};
