import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { RolRepository } from "../repositories/rol-repository.js"
import { PermisoRepository } from "../repositories/permiso-repository.js"

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY
const ROL = new RolRepository()
const permisoRepository = new PermisoRepository()

if (!SECRET_KEY) {
  console.error("ERROR: SECRET_KEY no está definido en las variables de entorno.")
  process.exit(1)
}

// Middleware para autenticar al usuario usando token en cookies
export const autenticar = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ exito: false, mensaje: "Acceso denegado, token no proporcionado" })
    }

    const decoded = jwt.verify(token, SECRET_KEY)
    req.usuario = decoded

    // Cargar permisos si no están presentes
    if (!req.usuario.permisos) {
      const permisos = await permisoRepository.obtenerPorUsuario(req.usuario.id)
      req.usuario.permisos = permisos.map((p) => ({ recurso: p.recurso, accion: p.accion }))
    }

    console.log("Usuario autenticado:", req.usuario.id, "con rol:", req.usuario.id_rol)
    next()
  } catch (error) {
    console.error("Error al verificar token:", error.message)
    return res.status(403).json({ exito: false, mensaje: "Token inválido o expirado" })
  }
}

// Middleware para autorizar por rol
export const autorizarRol = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(403).json({ exito: false, mensaje: "Acceso denegado. Usuario no autenticado" })
      }

      const rol = await ROL.obtenerRolPorId(req.usuario.id_rol)

      if (!rol || !rol.nombre) {
        return res.status(403).json({ exito: false, mensaje: "Rol no válido o no encontrado" })
      }

      const rolNombre = rol.nombre.toLowerCase()
      const rolesPermitidos = roles.map((r) => r.toLowerCase())

      if (roles.length === 0 || rolesPermitidos.includes(rolNombre)) {
        return next()
      }

      return res.status(403).json({
        exito: false,
        mensaje: `Acceso denegado. Requiere uno de los siguientes roles: ${roles.join(", ")}`,
        rolActual: rolNombre,
      })
    } catch (error) {
      console.error("Error en la autorización:", error)
      return res.status(500).json({ exito: false, mensaje: "Error interno en la autorización" })
    }
  }
}

// Middleware para verificar permisos específicos
export const verificarPermiso = (recurso, accion) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(403).json({ exito: false, mensaje: "Acceso denegado. Usuario no autenticado" })
      }

      const rol = await ROL.obtenerRolPorId(req.usuario.id_rol)

      if (!rol) {
        return res.status(403).json({ exito: false, mensaje: "Rol no encontrado" })
      }

      const rolNombre = rol.nombre.toLowerCase()

      // Los administradores tienen acceso a todo
      if (rolNombre === "administrador") {
        return next()
      }

      // Obtener permisos actualizados del usuario
      const permisos = await permisoRepository.obtenerPorUsuario(req.usuario.id)
      const tienePermiso = permisos.some((p) => p.recurso === recurso && p.accion === accion)

      if (tienePermiso) {
        return next()
      }

      return res.status(403).json({
        exito: false,
        mensaje: `Acceso denegado. Se requiere permiso para ${recurso}:${accion}`,
        rolActual: rolNombre,
      })
    } catch (error) {
      console.error("Error en la verificación de permisos:", error)
      return res.status(500).json({ exito: false, mensaje: "Error interno en la verificación de permisos" })
    }
  }
}

// Atajos para roles comunes
export const autorizarAdmin = (req, res, next) => autorizarRol(["administrador"])(req, res, next)
export const autorizarAdminOEmpleado = (req, res, next) => autorizarRol(["administrador", "empleado"])(req, res, next)
