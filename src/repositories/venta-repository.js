import Venta from "../models/venta-model.js";
import Pedido from "../models/pedido-model.js";
import Cliente from "../models/cliente-model.js";
import Producto from "../models/poductos-model.js";
import PedidoProducto from "../models/pedido-producto-model.js";

export class VentaRepository {
  async obtenerTodos() {
    return await Venta.findAll({
      include: [
        {
          model: Pedido,
          include: [
            {
              model: Cliente,
              attributes: ["id", "nombrecompleto", "telefono", "correoElectronico"]
            },
            {
              model: Producto,
              attributes: ["id", "nombre", "precio", "descripcion"],
              through: {
                model: PedidoProducto,
                attributes: ["cantidad", "precio_unitario", "subtotal"]
              }
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });
  }

  async obtenerPorId(id) {
    return await Venta.findByPk(id, {
      include: [
        {
          model: Pedido,
          include: [
            {
              model: Cliente,
              attributes: ["id", "nombrecompleto", "telefono", "correoElectronico"]
            },
            {
              model: Producto,
              attributes: ["id", "nombre", "precio", "descripcion"],
              through: {
                model: PedidoProducto,
                attributes: ["cantidad", "precio_unitario", "subtotal"]
              }
            }
          ]
        }
      ]
    });
  }

  async obtenerPorPedidoId(pedidoId) {
    return await Venta.findOne({
      where: {
        id_pedido: pedidoId
      }
    });
  }

  async crear(ventaData) {
    return await Venta.create(ventaData);
  }

  async actualizar(id, ventaData) {
    const venta = await Venta.findByPk(id);
    if (!venta) return null;
    
    await venta.update(ventaData);
    return await this.obtenerPorId(id);
  }

  async eliminar(id) {
    const venta = await Venta.findByPk(id);
    if (!venta) return null;
    
    await venta.destroy();
    return true;
  }

  async actualizarMetodoPago(id, metodoPago) {
    const venta = await Venta.findByPk(id);
    if (!venta) return null;
    
    await venta.update({ metodo_pago: metodoPago });
    return await this.obtenerPorId(id);
  }
}