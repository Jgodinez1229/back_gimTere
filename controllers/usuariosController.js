const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;

  // Validar que se envíen los datos
  if (!nombre || !correo || !contrasena || !rol) {
    return res.status(400).json({
      exito: false,
      mensaje: "Por favor llene todos los campos",
      detalles: "Todos los campos son obligatorios",
    });
  }

  try {
    // Generar hash de la contraseña
    const hashContrasena = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Llamamos al modelo para registrar el usuario
    const usuario = await Usuario.crearUsuario({
      nombre,
      correo,
      contrasena: hashContrasena,
      rol,
    });

    // Eliminamos la contraseña del objeto de respuesta
    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    res.status(201).json({
      exito: true,
      mensaje: "Usuario registrado exitosamente",
      datos: usuarioSinContrasena,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    if (error.code === "23505") {
      // Código PostgreSQL para duplicate key
      return res.status(400).json({
        exito: false,
        mensaje: "El correo ya está registrado",
        detalles: "Por favor use otro correo electrónico",
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: "Error al registrar usuario",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};
