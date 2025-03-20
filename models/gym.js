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
