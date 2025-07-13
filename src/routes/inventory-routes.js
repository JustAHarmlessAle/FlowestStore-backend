import { Router } from "express";
import { InventoryController } from "../controllers/inventory-controller.js";
import { 
  autenticar, 
  autorizarAdmin, 
  verificarPermiso 
} from "../middlewares/autenticador-validator.js";
import {
  validarCreacionInventario,
  validarActualizacionInventario,
  validarActualizacionStock,
  validarIdInventario
} from "../middlewares/inventory-validator.js";

const routerInventory = Router();
const inventoryController = new InventoryController();

// Rutas que requieren autenticación básica
routerInventory.get("/", 
  autenticar,
  inventoryController.obtenerProductos.bind(inventoryController)
);

routerInventory.get("/codigo/:codigo", 
  autenticar,
  inventoryController.buscarPorCodigo.bind(inventoryController)
);

routerInventory.get("/:id", 
  autenticar,
  validarIdInventario,
  inventoryController.obtenerProductoPorId.bind(inventoryController)
);

// Rutas que requieren permisos específicos
routerInventory.post("/",
  autenticar,
  verificarPermiso("inventario", "crear"),
  validarCreacionInventario,
  inventoryController.crearProducto.bind(inventoryController)
);

routerInventory.put("/:id",
  autenticar,
  verificarPermiso("inventario", "editar"),
  validarIdInventario,
  validarActualizacionInventario,
  inventoryController.actualizarProducto.bind(inventoryController)
);

routerInventory.patch("/:id/stock",
  autenticar,
  verificarPermiso("inventario", "editar"),
  validarIdInventario,
  validarActualizacionStock,
  inventoryController.actualizarStock.bind(inventoryController)
);

// Ruta que requiere permisos de administrador
routerInventory.delete("/:id",
  autenticar,
  autorizarAdmin,
  validarIdInventario,
  inventoryController.eliminarProducto.bind(inventoryController)
);

export default routerInventory;