import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

if (!SECRET_KEY) {
  console.error("ERROR: SECRET_KEY no está definido en las variables de entorno.")
  throw new Error("Error de configuración del servidor")
}

export const generarToken = (usuario) => {
  // Crear payload con información mínima necesaria
  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    id_rol: usuario.id_rol,
  }

  // Generar token con expiración de 24 horas
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
}

export const verificarToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    console.error("Error al verificar token:", error)
    return null
  }
}