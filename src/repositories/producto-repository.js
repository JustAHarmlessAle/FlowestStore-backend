import Producto from "../models/producto-model.js";
import Categoria from "../models/categoria-model.js";

export class ProductoRepository {
  async obtenerTodos() {
    return await Producto.findAll({
      include: [{
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nombre"]
      }],
      order: [["id", "DESC"]],
    });
  }

  async obtenerPorId(id) {
    return await Producto.findByPk(id);
  }

  async crear(productoData) {
    return await Producto.create(productoData);
  }

  async actualizar(id, productoData) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;

    return await producto.update(productoData);
  }

  async eliminar(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) return false;

    await producto.destroy();
    return true;
  }

  async cambiarPrecio(id, precio) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;

    return await producto.update({ precio });
  }
}
