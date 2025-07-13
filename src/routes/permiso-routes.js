import express from "express";
import {
  obtenerPermisos,
  obtenerPermisoId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
  obtenerPermisosPorRol

} from "../controllers/permiso-controller.js";
import {
  autenticar,
  autorizarAdmin,
  
} from "../middlewares/autenticador-validator.js";

const routerPermisos = express.Router();

// Rutas protegidas para administradores
routerPermisos.get("/", autenticar, autorizarAdmin, obtenerPermisos);
routerPermisos.get("/:id", autenticar, autorizarAdmin, obtenerPermisoId);
routerPermisos.post("/", autenticar, autorizarAdmin, crearPermiso);
routerPermisos.put("/:id", autenticar, autorizarAdmin, actualizarPermiso);
routerPermisos.delete("/:id", autenticar, autorizarAdmin, eliminarPermiso);
routerPermisos.get("/rol/:idRol", autenticar, obtenerPermisosPorRol);

export default routerPermisos;
