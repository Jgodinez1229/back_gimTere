const pool = require("../db");

exports.crearGym = async ({
  nombre,
  direccion,
  hora_entrada,
  hora_salida,
  descripcion,
}) => {
  const consulta = `
    INSERT INTO gimnasios (nombre, direccion, hora_entrada, hora_salida, descripcion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;

  const valores = [nombre, direccion, hora_entrada, hora_salida, descripcion];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

//Actualizar datos gym
exports.actualizarGym = async (
  id_gimnasio,
  { nombre, direccion, hora_entrada, hora_salida, descripcion }
) => {
  const consulta = `
  UPDATE gimnasios
  SET nombre = $1, direccion = $2, hora_entrada = $3, hora_salida = $4, descripcion = $5
  WHERE id_gimnasio = $6
  RETURNING *
  `;

  const valores = [
    nombre,
    direccion,
    hora_entrada,
    hora_salida,
    descripcion,
    id_gimnasio,
  ];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

//Listar los gym con total de entrenadores
exports.obtenerGyms = async () => {
  const consulta = `
    SELECT 
      g.*,
      COUNT(e.id_entrenador) as total_entrenadores
    FROM gimnasios g
    LEFT JOIN entrenadores e ON g.id_gimnasio = e.id_gimnasio
    GROUP BY g.id_gimnasio
    ORDER BY g.nombre ASC
  `;

  const resultado = await pool.query(consulta);
  return resultado.rows;
};

//Eliminar gym
exports.eliminarGym = async (id_gimnasio) => {
  // Iniciar transacción
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Primero desvincular entrenadores
    const desvincularEntrenadores = `
      UPDATE entrenadores 
      SET id_gimnasio = NULL,
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_gimnasio = $1
    `;
    await client.query(desvincularEntrenadores, [id_gimnasio]);

    // Luego eliminar el gimnasio
    const eliminarGimnasio = `
      DELETE FROM gimnasios 
      WHERE id_gimnasio = $1
      RETURNING *
    `;
    const resultado = await client.query(eliminarGimnasio, [id_gimnasio]);

    await client.query("COMMIT");
    return resultado.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
