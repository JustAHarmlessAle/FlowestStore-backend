import express from "express"
import { solicitarRecuperacion, verificarCodigo, cambiarPassword } from "../controllers/recuperacion-controller.js"

const recuperacionRoutes = express.Router()

// Rutas para recuperación de contraseña
recuperacionRoutes.post("/solicitar", solicitarRecuperacion)
recuperacionRoutes.post("/verificar", verificarCodigo)
recuperacionRoutes.post("/cambiar-password", cambiarPassword)

export default recuperacionRoutes
