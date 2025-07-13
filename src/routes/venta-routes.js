import { Router } from "express"
import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
} from "../controllers/venta-controller.js"
import { validarCreacionVenta, validarActualizacionVenta, validarIdVenta } from "../middlewares/venta-validator.js"
import { autenticar, autorizarAdmin, verificarPermiso } from "../middlewares/autenticador-validator.js"

const routerVenta = Router()

routerVenta.get("/", autenticar, obtenerVentas)
routerVenta.get("/:id", autenticar, validarIdVenta, obtenerVentaPorId)
routerVenta.post("/", 
  autenticar, 
  verificarPermiso("ventas", "crear"), 
  validarCreacionVenta, 
  crearVenta
)
routerVenta.put("/:id/metodo-pago", 
  autenticar, 
  verificarPermiso("ventas", "editar"), 
  validarIdVenta, 
  validarActualizacionVenta, 
  actualizarVenta
)
routerVenta.delete("/:id", 
  autenticar, 
  autorizarAdmin, // Mantener solo admin para eliminar
  validarIdVenta, 
  eliminarVenta
)


export default routerVenta