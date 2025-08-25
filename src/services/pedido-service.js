import Pedido from "../models/pedido-model.js";
import Cliente from "../models/cliente-model.js";
import Producto from "../models/poductos-model.js";
import PedidoProducto from "../models/pedido-producto-model.js";
import { sequelize } from "../config/database.js";

export class PedidoService {
  async obtenerTodos() {
    return await Pedido.findAll({
      include: [
        {
          model: Cliente,
          attributes: ["nombrecompleto", "telefono","correoElectronico"],
        },
        {
          model: Producto,
          attributes: ["id", "nombre", "precio"],
          through: {
            model: PedidoProducto,
            attributes: ["id", "cantidad", "precio_unitario", "subtotal"],
          },
        },
      ], 
      order: [["id", "DESC"]],
    });
  }

  // 👇 AÑADE ESTA NUEVA FUNCIÓN
  async obtenerPedidosPorClienteId(clienteId) {
    return await Pedido.findAll({
      where: { id_cliente: clienteId },
      include: [
        {
          model: Producto,
          attributes: ["nombre", "imagenUrl"], // Traemos solo lo necesario del producto
          through: {
            // A través de la tabla intermedia
            model: PedidoProducto,
            attributes: ["cantidad", "precio_unitario"], // Traemos la cantidad y el precio de ese momento
          },
        },
      ],
      order: [["fecha_pedido", "DESC"]], // Ordenar por los más recientes primero
    });
  }

  async obtenerPorId(id) {
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Cliente,
          attributes: ["nombrecompleto","correoElectronico"],
        },
        {
          model: Producto,
          attributes: ["id", "nombre", "precio"],
          through: {
            attributes: ["id", "cantidad", "precio_unitario", "subtotal"],
          },
        },
      ],
    });

    if (!pedido) throw new Error("Pedido no encontrado");
    return pedido.get({ plain: true });
  }

  async crearpedidos(pedidoData) {
    const { productos, id_cliente, documentoIdentidad, ...datosPedido } = pedidoData;

    if (!productos?.length) {
      throw new Error("Debe incluir al menos un producto");
    }

    if (!id_cliente && !documentoIdentidad) {
      throw new Error("Debe proporcionar el id_cliente o el documentoIdentidad");
    }

    let transaction;
    try {
      transaction = await sequelize.transaction();

      let pedidoPayload = { ...datosPedido, total: 0 };
      if (id_cliente) pedidoPayload.id_cliente = id_cliente;
      if (documentoIdentidad) pedidoPayload.documentoIdentidad = documentoIdentidad;

      const pedido = await Pedido.create(pedidoPayload, { transaction });

      for (const p of productos) {
        // Modificado aquí: usar p.id_producto en lugar de p.producto_id
        const producto = await Producto.findByPk(p.id_producto, { transaction });
        if (!producto) throw new Error(`Producto ${p.id_producto} no encontrado`);

        await PedidoProducto.create(
          {
            pedido_id: pedido.id,
            producto_id: p.id_producto,
            cantidad: p.cantidad,
            precio_unitario: producto.precio,
            subtotal: p.cantidad * producto.precio,
          },
          { transaction }
        );
      }

      const total = await PedidoProducto.sum("subtotal", {
        where: { pedido_id: pedido.id },
        transaction,
      });

      await pedido.update({ total }, { transaction });
      await transaction.commit();

      return pedido;
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async actualizarpedidos(id, pedidoData) {
    const { productos, ...datosPedido } = pedidoData;
    let transaction;

    try {
      transaction = await sequelize.transaction();
      const pedido = await Pedido.findByPk(id, { transaction });

      if (!pedido) throw new Error("Pedido no encontrado para actualizar");

      await pedido.update(datosPedido, { transaction });

      if (productos && Array.isArray(productos)) {
        await PedidoProducto.destroy({ where: { pedido_id: id }, transaction });

        for (const p of productos) {
          // Modificado aquí también: usar p.id_producto en lugar de p.producto_id
          const producto = await Producto.findByPk(p.id_producto, { transaction });
          if (!producto) throw new Error(`Producto ${p.id_producto} no encontrado`);

          await PedidoProducto.create(
            {
              pedido_id: pedido.id,
              producto_id: p.id_producto,
              cantidad: p.cantidad,
              precio_unitario: producto.precio,
              subtotal: p.cantidad * producto.precio,
            },
            { transaction }
          );
        }

        const total = await PedidoProducto.sum("subtotal", {
          where: { pedido_id: id },
          transaction,
        });

        await pedido.update({ total }, { transaction });
      }

      await transaction.commit();
      return await this.obtenerPorId(id);
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      throw error;
    }
  }

  async eliminarpedidos(id) {
    const pedido = await this.obtenerPorId(id);

    if (pedido.estado === "terminado") {
      throw new Error("No se puede eliminar un pedido que ya fue entregado");
    }

    await PedidoProducto.destroy({ where: { pedido_id: id } });
    await Pedido.destroy({ where: { id } });
    return { mensaje: "Pedido eliminado exitosamente" };
  }

  async cambiarEstadopedidos(id, estado) {
    const pedido = await Pedido.findByPk(id);

    const estadosValidos = ["pendiente", "preparacion", "terminado", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      throw new Error("Estado no válido");
    }

    return await pedido.update({ estado });
  }
  async obtenerTerminados() {
    return await Pedido.findAll({
      where: { estado: "terminado" },
      include: [
        {
          model: Cliente,
          attributes: ["nombrecompleto", "telefono", "correoElectronico"],
        },
        {
          model: Producto,
          attributes: ["id", "nombre", "precio"],
          through: {
            model: PedidoProducto,
            attributes: ["id", "cantidad", "precio_unitario", "subtotal"],
          },
        },
      ],
      order: [["id", "DESC"]],
    })
  }
}