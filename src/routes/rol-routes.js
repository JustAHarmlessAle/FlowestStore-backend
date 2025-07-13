import { Router } from "express"
import {
  obtenerTodosLosRoles,
  // obtenerRolesActivos,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  cambiarEstadoRol,
  activarRol,
  desactivarRol,
  eliminarRol,
} from "../controllers/rol-controller.js"

import { createRolValidation, validacionActualizacionRol, validarIdRol } from "../middlewares/rol-validator.js"
import { handleValidationErrors } from "../middlewares/validationHandler.js"

const routerol = Router()

// Rutas existentes
routerol.get("/", obtenerTodosLosRoles)
// routerol.get("/activos", obtenerRolesActivos)
routerol.get("/:id", validarIdRol, handleValidationErrors, obtenerRolPorId)
routerol.post("/", createRolValidation, handleValidationErrors, crearRol)
routerol.put("/:id", validarIdRol, validacionActualizacionRol, handleValidationErrors, actualizarRol)
routerol.delete("/:id", validarIdRol, handleValidationErrors, eliminarRol)

// Nuevas rutas para manejo de estado
routerol.patch("/:id/estado", validarIdRol, handleValidationErrors, cambiarEstadoRol)
routerol.patch("/:id/activar", validarIdRol, handleValidationErrors, activarRol)
routerol.patch("/:id/desactivar", validarIdRol, handleValidationErrors, desactivarRol)

export default routerol
