import { InventoryRepository } from "../repositories/inventory-repository.js";
import { sequelize } from "../config/database.js";

export class InventoryService {
  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  async listarProductosInventario() {
    return await this.inventoryRepository.obtenerTodos();
  }

  async buscarProductoInventarioPorId(id) {
    const producto = await this.inventoryRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error("Producto no encontrado en inventario");
    }
    return producto;
  }

  async registrarProductoInventario(datosProducto) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const productoExistente = await this.inventoryRepository.obtenerPorCodigo(datosProducto.codigo);
      if (productoExistente) {
        throw new Error("Ya existe un producto con este código");
      }

      const nuevoProducto = await this.inventoryRepository.crear(datosProducto);
      await transaction.commit();
      return nuevoProducto;
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async modificarProductoInventario(id, datosActualizados) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const productoExistente = await this.inventoryRepository.obtenerPorId(id);
      if (!productoExistente) {
        throw new Error("Producto no encontrado en inventario");
      }

      if (datosActualizados.codigo && datosActualizados.codigo !== productoExistente.codigo) {
        const codigoExistente = await this.inventoryRepository.obtenerPorCodigo(datosActualizados.codigo);
        if (codigoExistente) {
          throw new Error("Ya existe un producto con este código");
        }
      }

      const productoActualizado = await this.inventoryRepository.actualizar(id, {
        ...datosActualizados,
        fecha_ultima_modificacion: new Date()
      });

      await transaction.commit();
      return productoActualizado;
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async eliminarProductoInventario(id) {
    const eliminado = await this.inventoryRepository.eliminar(id);
    if (!eliminado) {
      throw new Error("No se pudo eliminar el producto del inventario");
    }
    return { mensaje: "Producto eliminado exitosamente del inventario" };
  }

  async actualizarStockProducto(id, nuevaCantidad) {
    const productoActualizado = await this.inventoryRepository.actualizarCantidad(id, nuevaCantidad);
    if (!productoActualizado) {
      throw new Error("No se pudo actualizar el stock del producto");
    }
    return productoActualizado;
  }

  async buscarProductoPorCodigo(codigo) {
    const producto = await this.inventoryRepository.obtenerPorCodigo(codigo);
    if (!producto) {
      throw new Error("Producto no encontrado con ese código");
    }
    return producto;
  }
}