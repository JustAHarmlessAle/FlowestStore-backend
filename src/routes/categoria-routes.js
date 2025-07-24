import { Router } from "express"
import {
  obtenerTodasLasCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria-controller.js"
import {
  createValidation,
  validacionActualizacionCategorias,
  validarIdCategoria,
} from "../middlewares/categoria-validator.js"

import { autenticar, autorizarAdmin, verificarPermiso } from "../middlewares/autenticador-validator.js"

const routercategoria = Router()

routercategoria.get("/",
  autenticar, 
  obtenerTodasLasCategorias)

routercategoria.get("/Categorias/DeLa/Home/Page",
  obtenerTodasLasCategorias)

routercategoria.get("/:id", autenticar, 
validarIdCategoria, 
obtenerCategoriaPorId)
routercategoria.post("/", 
  autenticar, 
  verificarPermiso("categorias", "crear"), 
  createValidation, 
  crearCategoria
)
routercategoria.put("/:id",
  autenticar,
  verificarPermiso("categorias", "editar"),
  validacionActualizacionCategorias,
  validarIdCategoria,
  actualizarCategoria
)
routercategoria.delete("/:id", 
  autenticar, 
  autorizarAdmin, // Mantener solo admin para eliminar
  validarIdCategoria, 
  eliminarCategoria
)

export default routercategoria