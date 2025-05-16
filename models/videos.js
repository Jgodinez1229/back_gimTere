const pool = require("../db");

exports.publicarVideo = async ({ id_entrenador, categoria, url }) => {
  const consulta = `
    INSERT INTO videos (id_entrenador, categoria, url)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const valores = [id_entrenador, categoria, url];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

exports.obtenerVideosPorEntrenador = async (id_entrenador) => {
  const consulta = `
    SELECT * FROM videos
    WHERE id_entrenador = $1
    ORDER BY fecha_publicacion DESC
  `;
  const resultado = await pool.query(consulta, [id_entrenador]);
  return resultado.rows;
};

exports.eliminarVideo = async (id_video, id_entrenador) => {
  const consulta = `
    DELETE FROM videos
    WHERE id_video = $1 AND id_entrenador = $2
    RETURNING *
  `;
  const resultado = await pool.query(consulta, [id_video, id_entrenador]);
  return resultado.rows[0];
};

exports.obtenerTodosLosVideos = async () => {
  const consulta = `
    SELECT * FROM videos
    ORDER BY fecha_publicacion DESC
  `;
  const resultado = await pool.query(consulta);
  return resultado.rows;
};
