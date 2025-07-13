import CodigoRecuperacion from "../models/codigo-recuperacion-model.js"
import Usuario from "../models/usuario-model.js"
import emailService from "./email-service.js"
import bcrypt from "bcryptjs"
import { Op } from "sequelize"

class RecuperacionService {
  generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async solicitarRecuperacion(email) {
    try {
      console.log("\n🔄 =================================")
      console.log("🔄 INICIANDO PROCESO DE RECUPERACIÓN")
      console.log("🔄 =================================")
      console.log("📧 Email solicitado:", email)

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido")
      }

      // Buscar usuario por email
      console.log("🔍 Buscando usuario en la base de datos...")
      const usuario = await Usuario.findOne({ where: { email } })

      if (!usuario) {
        console.log("❌ Usuario no encontrado para email:", email)
        throw new Error("No existe un usuario con este correo electrónico")
      }

      console.log("✅ Usuario encontrado:")
      console.log("   ID:", usuario.id)
      console.log("   Nombre:", usuario.nombre)
      console.log("   Email:", usuario.email)

      // Limpiar códigos anteriores no utilizados para este usuario
      console.log("🧹 Limpiando códigos anteriores...")
      await CodigoRecuperacion.destroy({
        where: {
          usuario_id: usuario.id,
          utilizado: false,
        },
      })

      // Generar nuevo código
      const codigo = this.generarCodigo()
      console.log("🔢 Código generado:", codigo)

      // Establecer expiración (15 minutos)
      const expiracion = new Date()
      expiracion.setMinutes(expiracion.getMinutes() + 15)
      console.log("⏰ Código expirará el:", expiracion.toLocaleString())

      // Guardar código en la base de datos
      console.log("💾 Guardando código en la base de datos...")
      const codigoGuardado = await CodigoRecuperacion.create({
        usuario_id: usuario.id,
        codigo,
        expiracion,
        utilizado: false,
      })

      console.log("✅ Código guardado con ID:", codigoGuardado.id)

      // Enviar código por email
      console.log("📧 Iniciando envío de email...")
      try {
        const resultadoEmail = await emailService.enviarCodigoRecuperacion(email, codigo)
        console.log("✅ Email enviado exitosamente!")
        console.log("📋 Resultado del envío:", resultadoEmail)
      } catch (emailError) {
        console.error("❌ Error específico al enviar email:", emailError.message)

        // Eliminar el código de la BD si no se pudo enviar el email
        await CodigoRecuperacion.destroy({ where: { id: codigoGuardado.id } })

        throw new Error(`No se pudo enviar el email: ${emailError.message}`)
      }

      console.log("🔄 =================================")
      console.log("🔄 PROCESO COMPLETADO EXITOSAMENTE")
      console.log("🔄 =================================\n")

      return {
        success: true,
        message: "Código enviado exitosamente",
        codigoId: codigoGuardado.id,
      }
    } catch (error) {
      console.error("\n❌ =================================")
      console.error("❌ ERROR EN PROCESO DE RECUPERACIÓN")
      console.error("❌ =================================")
      console.error("❌ Error:", error.message)
      console.error("❌ Stack:", error.stack)
      console.error("❌ =================================\n")

      throw error
    }
  }

  // Resto de métodos...
  async verificarCodigo(email, codigo) {
    try {
      const usuario = await Usuario.findOne({ where: { email } })
      if (!usuario) {
        throw new Error("No existe un usuario con este correo electrónico")
      }

      const codigoRecuperacion = await CodigoRecuperacion.findOne({
        where: {
          usuario_id: usuario.id,
          codigo,
          expiracion: { [Op.gt]: new Date() },
          utilizado: false,
        },
      })

      if (!codigoRecuperacion) {
        throw new Error("Código inválido o expirado")
      }

      return {
        valido: true,
        usuario_id: usuario.id,
        codigo_id: codigoRecuperacion.id,
      }
    } catch (error) {
      console.error("Error al verificar código:", error)
      throw error
    }
  }

  async cambiarPassword(usuario_id, codigo_id, nuevaPassword) {
    try {
      const usuario = await Usuario.findByPk(usuario_id)
      if (!usuario) {
        throw new Error("Usuario no encontrado")
      }

      const codigoRecuperacion = await CodigoRecuperacion.findOne({
        where: {
          id: codigo_id,
          usuario_id,
          expiracion: { [Op.gt]: new Date() },
          utilizado: false,
        },
      })

      if (!codigoRecuperacion) {
        throw new Error("Código inválido o expirado")
      }

      // Verificar que la nueva contraseña no sea igual a la anterior
      const esIgual = await bcrypt.compare(nuevaPassword, usuario.password)
      if (esIgual) {
        throw new Error("La nueva contraseña no puede ser igual a la anterior")
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaPassword, 10)

      // Actualizar contraseña
      await usuario.update({ password: hashedPassword })

      // Marcar código como utilizado
      await codigoRecuperacion.update({ utilizado: true })

      return true
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      throw error
    }
  }
}

export default new RecuperacionService()
