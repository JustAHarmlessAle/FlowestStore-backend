import { Router } from "express"
import {
  obtenerProductos,
  obtenerProductoPorID,
  crearProductos,
  actualizarProductos,
  eliminarProductos,
} from "../controllers/productos-controller.js"
import {
  validarCreacionProducto,
  validarActualizacionProducto,
  validarIdProducto,
} from "../middlewares/productos-validator.js"
import { autenticar, verificarPermiso } from "../middlewares/autenticador-validator.js" // Asumiendo que este es el archivo correcto
import upload from "../middlewares/multer.js"; // 👈 1. IMPORTAR MULTER

const routerProductos = Router()

// Rutas públicas o que solo requieren autenticación
routerProductos.get("/", obtenerProductos)
routerProductos.get("/:id", validarIdProducto, obtenerProductoPorID)

// Rutas que requieren autenticación y permisos específicos
routerProductos.post("/",
  autenticar,
  verificarPermiso("productos", "crear"),
  upload.single('imagen'), // 👈 Multer procesará un solo archivo del campo 'imagen'
  validarCreacionProducto,
  crearProductos
)

routerProductos.put(
  "/:id",
  autenticar,
  verificarPermiso("productos", "editar"),
  upload.single('imagen'), // 👈 También aquí para la actualización
  validarIdProducto,
  validarActualizacionProducto,
  actualizarProductos
)

routerProductos.delete(
  "/:id",
  autenticar,
  verificarPermiso("productos", "eliminar"),
  validarIdProducto,
  eliminarProductos
)

// Ruta para cambiar el estado de un producto
routerProductos.patch(
  "/:id/estado",
  autenticar,
  verificarPermiso("productos", "editar"), // Asumiendo que cambiar estado requiere permiso de edición
  validarIdProducto,
  async (req, res) => {
    try {
      const { id } = req.params
      const { estado } = req.body

      if (!estado || !["activo", "inactivo"].includes(estado)) {
        return res.status(400).json({
          exito: false,
          mensaje: "El estado debe ser 'activo' o 'inactivo'",
        })
      }

      // Importar el servicio de productos
      const { ProductoService } = await import("../services/producto-services.js")
      const productoService = new ProductoService()

      // Obtener el producto actual
      const producto = await productoService.obtenerProductoPorId(id)

      // Actualizar solo el estado
      const productoActualizado = await productoService.actualizarProducto(id, { estado })

      res.status(200).json({
        exito: true,
        data: productoActualizado,
        mensaje: `Estado del producto actualizado a '${estado}'`,
      })
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error)
      res.status(500).json({
        exito: false,
        mensaje: "Error al cambiar el estado del producto",
        error: error.message,
      })
    }
  }
)

export default routerProductos