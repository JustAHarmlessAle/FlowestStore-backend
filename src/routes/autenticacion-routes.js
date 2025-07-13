import { Router } from "express"
import {
  login,
  obtenerUsuarioAutenticado,
  logout,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearUsuarioController,
} from "../controllers/autenticador-controller.js"
import { autenticar, autorizarAdmin } from "../middlewares/autenticador-validator.js"

const router = Router()
// Rutas públicas
router.post("/register", login)
router.post("/logout", logout)
// Rutas protegidas
router.get("/usuario-autenticado", autenticar, obtenerUsuarioAutenticado)
// Rutas de administración (protegidas y solo para admin)
router.get("/usuarios", autenticar, autorizarAdmin, obtenerUsuarios)
router.get("/usuarios/:id", autenticar, autorizarAdmin, obtenerUsuario)
router.post("/usuarios", crearUsuarioController)
router.put("/usuarios/:id", autenticar, autorizarAdmin, actualizarUsuario)
router.delete("/usuarios/:id", autenticar, autorizarAdmin, eliminarUsuario)

// Nueva ruta para cambiar el estado de un usuario
router.put("/usuarios/:id/estado", autenticar, autorizarAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    if (!estado || !["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({
        exito: false,
        mensaje: "El estado debe ser 'activo' o 'inactivo'",
      })
    }
    // Importar el servicio de usuarios
    const { UsuarioService } = await import("../services/usuario-services.js")
    const usuarioService = new UsuarioService()
    // Obtener el usuario actual para verificar que existe
    const usuario = await usuarioService.obtenerUsuarioPorId(id)
    // Actualizar solo el estado
    const usuarioActualizado = await usuarioService.actualizarUsuario(id, { estado })
    res.status(200).json({
      exito: true,
      data: usuarioActualizado,
      mensaje: `Estado del usuario actualizado a '${estado}'`,
    })
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al cambiar el estado del usuario",
      error: error.message,
    })
  }
})

export default router