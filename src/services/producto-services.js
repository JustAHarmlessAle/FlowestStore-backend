import Producto from "../models/poductos-model.js";
import Categoria from "../models/categoria-model.js";

export class ProductoService {

    async obtenerProducto() {
        return await Producto.findAll({
            include: [{
                model: Categoria,
                attributes: ["id", "nombre"]
            }],
            order: [["id", "DESC"]],
        });
    }

    async obtenerProductoPorId(id) {
        const producto = await Producto.findByPk(id);
        if (!producto) throw new Error("Producto no encontrado");
        return producto;
    }

    async crearProducto(productoData) {
        return await Producto.create(productoData);
    }

    async actualizarProducto(id, productoData) {
        const producto = await this.obtenerProductoPorId(id);
        return await producto.update(productoData);
    }

    async eliminarProducto(id) {
        const producto = await this.obtenerProductoPorId(id);
        await producto.destroy();
        return { mensaje: "Producto eliminado con éxito" };
    }
}
