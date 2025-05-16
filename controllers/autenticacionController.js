const Auth = require("../models/autenticacion");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("../config/emailController");

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
    // Verificar si existe el usuario
    const usuario = await Auth.buscarUsuarioPorCorreo(correo);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: "Correo no registrado",
        detalles: "El correo electrónico no está registrado en el sistema",
      });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: "Contraseña incorrecta",
        detalles: "La contraseña ingresada no es correcta",
      });
    }

    // Generar token 2FA
    const token2FA = crypto.randomInt(100000, 999999).toString();
    const expiracion = new Date(Date.now() + 10 * 60000);

    try {
      // Guardar token en la base de datos
      await Auth.guardarToken2FA(usuario, token2FA, expiracion);

      // Intentar enviar el correo
      await transporter.sendMail({
        from: '"Tu Gimnasio" <noreply@tugimnasio.com>',
        to: usuario.correo,
        subject: "Código de verificación",
        text: `Tu código de verificación es: ${token2FA}. Este código expirará en 10 minutos.`,
        html: `<h1>Código de verificación</h1>
               <p>Tu código de verificación es: <strong>${token2FA}</strong></p>
               <p>Este código expirará en 10 minutos.</p>`,
      });

      const idKey =
        usuario.tipo === "entrenador" ? "id_entrenador" : "id_usuario";

      res.json({
        exito: true,
        mensaje: "Código de verificación enviado",
        datos: {
          [idKey]: usuario[idKey],
          tipo: usuario.tipo,
          requiere_2fa: true,
        },
      });
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);

      // Limpiar el token si el correo falló
      await Auth.limpiarToken2FA(
        usuario[usuario.tipo === "entrenador" ? "id_entrenador" : "id_usuario"],
        usuario.tipo
      );

      return res.status(500).json({
        exito: false,
        mensaje: "Error al enviar el código",
        detalles:
          "No se pudo enviar el código de verificación al correo especificado",
      });
    }
  } catch (error) {
    console.error("Error en el proceso de inicio de sesión:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error en el servidor",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

exports.verificarToken = async (req, res) => {
  const { id_usuario, id_entrenador, token, tipo } = req.body;
  const id = tipo === "entrenador" ? id_entrenador : id_usuario;

  if (!id || !token || !tipo) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El ID, tipo y token son obligatorios",
    });
  }

  try {
    const usuario = await Auth.verificarToken2FA(id, token, tipo);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: "Verificación fallida",
        detalles: "Token inválido o expirado",
      });
    }

    // Limpiar el token usado
    await Auth.limpiarToken2FA(id, tipo);

    // Eliminar la contraseña del objeto de respuesta
    const {
      contrasena,
      token_2fa,
      token_2fa_expiracion,
      ...usuarioSinDatosSensibles
    } = usuario;

    res.json({
      exito: true,
      mensaje: "Verificación exitosa",
      datos: usuarioSinDatosSensibles,
    });
  } catch (error) {
    console.error("Error en la verificación:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error en la verificación",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};
