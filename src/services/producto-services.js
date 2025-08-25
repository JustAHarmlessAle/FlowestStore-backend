// --- START OF FILE producto-services.js (BACKEND - CORREGIDO) ---

import Producto from "../models/poductos-model.js";
import Categoria from "../models/categoria-model.js";

export class ProductoService {

    async obtenerProducto() {
        return await Producto.findAll({
            // 👇 AÑADE ESTA SECCIÓN DE 'attributes'
            attributes: [
                "id",
                "nombre",
                "descripcion",
                "precio",
                "estado",
                "imagenUrl", // ¡La clave está aquí!
                "Id_Categoria",
                "createdAt",
                "updatedAt"
            ],
            include: [{
                model: Categoria,
                attributes: ["id", "nombre"]
            }],
            order: [["id", "DESC"]],
        });
    }

    // ... el resto de tus funciones (obtenerProductoPorId, crearProducto, etc.) no necesitan cambios ...

    async obtenerProductoPorId(id) {
        const producto = await Producto.findByPk(id, { // También es buena idea ser explícito aquí
             attributes: [
                "id",
                "nombre",
                "descripcion",
                "precio",
                "estado",
                "imagenUrl",
                "Id_Categoria",
                "createdAt",
                "updatedAt"
            ],
            include: [{
                model: Categoria,
                attributes: ["id", "nombre"]
            }]
        });
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