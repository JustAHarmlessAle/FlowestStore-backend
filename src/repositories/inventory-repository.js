import Inventory from '../models/inventory-model.js';

export class InventoryRepository {
  
  async obtenerTodos() {
    return await Inventory.findAll({
      order: [["id", "DESC"]],
    });
  }

  async obtenerPorId(id) {
    return await Inventory.findByPk(id);
  }

  async crear(inventoryData) {
    return await Inventory.create(inventoryData);
  }

  async actualizar(id, inventoryData) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    return await inventory.update(inventoryData);
  }

  async eliminar(id) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return false;

    await inventory.destroy();
    return true;
  }

  async actualizarCantidad(id, nuevaCantidad) {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;

    if (nuevaCantidad < 0) {
      throw new Error("La cantidad no puede ser negativa");
    }

    return await inventory.update({ 
      cantidad: nuevaCantidad,
      fecha_ultima_modificacion: new Date()
    });
  }

  async obtenerPorCodigo(codigo) {
    return await Inventory.findOne({
      where: { codigo }
    });
  }
}