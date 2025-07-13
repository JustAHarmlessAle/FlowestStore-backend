import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async enviarCodigoRecuperacion(email, codigo) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Código de recuperación de contraseña",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
            <p style="color: #555; font-size: 16px;">Has solicitado recuperar tu contraseña. Utiliza el siguiente código para continuar con el proceso:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h3 style="color: #333; letter-spacing: 5px; font-size: 24px; margin: 0;">${codigo}</h3>
            </div>
            <p style="color: #555; font-size: 14px;">Este código expirará en 15 minutos. Si no solicitaste recuperar tu contraseña, puedes ignorar este correo.</p>
            <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">© ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
          </div>
        `,
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log("Email enviado:", info.response)
      return true
    } catch (error) {
      console.error("Error al enviar email:", error)
      throw new Error("Error al enviar el correo electrónico")
    }
  }
}

export default new EmailService()
