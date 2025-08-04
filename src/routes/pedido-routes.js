import { Router } from "express"
import {
  obtenerTodos,
  obtenerPorId,
  crearpedidos,
  actualizarpedidos,
  eliminarpedidos,
  cambiarEstadopedidos,
} from "../controllers/pedido-controller.js"
import {
  validarCreacionPedido,
  validarActualizacionPedido,
  validarIdPedido,
  validarCambioEstadoPedido,
} from "../middlewares/pedido-validator.js"
import { autenticar, autorizarAdmin, verificarPermiso } from "../middlewares/autenticador-validator.js"

const routerpedido = Router()


routerpedido.get("/pedido",// autenticar,
 obtenerTodos)
routerpedido.get("/:id",//autenticar, validarIdPedido,
                 //autenticacion
   obtenerPorId)
routerpedido.post("/", 
  // autenticar, 
  // verificarPermiso("pedidos", "crear"), 
  validarCreacionPedido, 
  crearpedidos
)
routerpedido.put("/:id", 
  autenticar, 
  verificarPermiso("pedidos", "editar"), 
  validarIdPedido, 
  validarActualizacionPedido, 
  actualizarpedidos
)
routerpedido.delete("/:id", 
  autenticar, 
  autorizarAdmin, // Mantener solo admin para eliminar
  validarIdPedido, 
  eliminarpedidos
)
routerpedido.patch(
  "/:id/estado",
  autenticar,
  verificarPermiso("pedidos", "editar"),
  validarIdPedido,
  validarCambioEstadoPedido,
  cambiarEstadopedidos
  
)

export default routerpedido