import recuperacionService from "../services/recuperacion-service.js"

// Solicitar recuperación de contraseña
// Solicitar recuperación de contraseña
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        exito: false,
        mensaje: "El correo electrónico es obligatorio",
      })
    }

    // Para depuración
    console.log("Solicitud de recuperación recibida para:", email)

    await recuperacionService.solicitarRecuperacion(email)

    res.status(200).json({
      exito: true,
      mensaje: "Se ha enviado un código de recuperación a tu correo electrónico",
    })
  } catch (error) {
    console.error("Error al solicitar recuperación:", error)
    res.status(400).json({
      exito: false,
      mensaje: error.message || "Error al solicitar recuperación de contraseña",
    })
  }
}


// Verificar código de recuperación
export const verificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body

    if (!email || !codigo) {
      return res.status(400).json({
        exito: false,
        mensaje: "El correo electrónico y el código son obligatorios",
      })
    }

    const resultado = await recuperacionService.verificarCodigo(email, codigo)

    res.status(200).json({
      exito: true,
      mensaje: "Código verificado correctamente",
      ...resultado,
    })
  } catch (error) {
    console.error("Error al verificar código:", error)
    res.status(400).json({
      exito: false,
      mensaje: error.message || "Error al verificar el código",
    })
  }
}

// Cambiar contraseña
export const cambiarPassword = async (req, res) => {
  try {
    const { usuario_id, codigo_id, password } = req.body

    if (!usuario_id || !codigo_id || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: "Todos los campos son obligatorios",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        exito: false,
        mensaje: "La contraseña debe tener al menos 6 caracteres",
      })
    }

    await recuperacionService.cambiarPassword(usuario_id, codigo_id, password)

    res.status(200).json({
      exito: true,
      mensaje: "Contraseña actualizada correctamente",
    })
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    res.status(400).json({
      exito: false,
      mensaje: error.message || "Error al cambiar la contraseña",
    })
  }
}
