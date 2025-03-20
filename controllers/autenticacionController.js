const Auth = require("../models/autenticacion");
const bcrypt = require("bcrypt");

exports.iniciarSesion = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El correo y la contraseña son obligatorios",
    });
  }

  try {
    const usuario = await Auth.buscarUsuarioPorCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: "Credenciales inválidas",
        detalles: "El correo o la contraseña son incorrectos",
      });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: "Credenciales inválidas",
        detalles: "El correo o la contraseña son incorrectos",
      });
    }

    // Eliminar la contraseña del objeto de respuesta
    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    res.json({
      exito: true,
      mensaje: "Inicio de sesión exitoso",
      datos: {
        ...usuarioSinContrasena,
        tipo: usuario.tipo, // 'cliente' o 'entrenador'
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al iniciar sesión",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};
