// venta-service.js

import { VentaRepository } from "../repositories/venta-repository.js";
import Pedido from "../models/pedido-model.js";
import Cliente from "../models/cliente-model.js";
import Producto from "../models/poductos-model.js"; // Asegúrate de que el nombre del archivo sea correcto
import PedidoProducto from "../models/pedido-producto-model.js"; // Importación añadida

export class VentaService {
  constructor() {
    this.ventaRepository = new VentaRepository();
  }

  async obtenerTodos() {
    try {
      const ventas = await this.ventaRepository.obtenerTodos();
      if (ventas.length === 0) {
        throw new Error("No hay ventas registradas.");
      }
      return ventas;
    } catch (error) {
      console.error("Error en servicio obtenerTodos:", error);
      throw error;
    }
  }

  async obtenerPorId(id) {
    try {
      const venta = await this.ventaRepository.obtenerPorId(id);
      if (!venta) {
        throw new Error("Venta no encontrada.");
      }
      return venta;
    } catch (error) {
      console.error("Error en servicio obtenerPorId:", error);
      throw error;
    }
  }

  async crear(ventaData) {
    try {
      // Verificar si el pedido existe y está terminado
      const pedido = await Pedido.findByPk(ventaData.id_pedido, {
        include: [
          {
            model: Cliente,
            attributes: ["id", "nombrecompleto", "telefono", "correoElectronico"]
          },
          {
            model: Producto,
            through: {
              model: PedidoProducto,
              attributes: ["cantidad", "precio_unitario", "subtotal"]
            }
          }
        ]
      });

      if (!pedido) {
        throw new Error("El pedido no existe.");
      }

      if (pedido.estado !== "terminado") {
        throw new Error("No se puede realizar la venta. El pedido no está terminado.");
      }

      // Verificar si ya existe una venta para este pedido
      const ventaExistente = await this.ventaRepository.obtenerPorPedidoId(ventaData.id_pedido);
      if (ventaExistente) {
        throw new Error("Ya existe una venta registrada para este pedido.");
      }

      // Establecer el total a pagar
      ventaData.total_pagar = pedido.total;

      if (ventaData.total_pagar <= 0) {
        throw new Error("El total de la venta debe ser mayor a 0.");
      }

      // Validar método de pago
      const metodosValidos = ["efectivo", "transferencia"];
      if (!metodosValidos.includes(ventaData.metodo_pago)) {
        throw new Error("Método de pago no válido. Debe ser 'efectivo' o 'transferencia'.");
      }

      // Crear la nueva venta
      const nuevaVenta = await this.ventaRepository.crear(ventaData);

      // Obtener la venta completa con sus relaciones
      return await this.obtenerPorId(nuevaVenta.id);
    } catch (error) {
      console.error("Error en servicio crear:", error);
      throw error;
    }
  }

  async actualizar(id, ventaData) {
    try {
      // Verificar si la venta existe
      const venta = await this.ventaRepository.obtenerPorId(id);
      if (!venta) {
        throw new Error("Venta no encontrada.");
      }
  
      // Validar método de pago si se está actualizando
      if (ventaData.metodo_pago) {
        const metodosValidos = ["efectivo", "transferencia"];
        if (!metodosValidos.includes(ventaData.metodo_pago)) {
          throw new Error("Método de pago no válido.");
        }
      }

      // Actualizar la venta
      return await this.ventaRepository.actualizar(id, ventaData);
    } catch (error) {
      console.error("Error en servicio actualizar:", error);
      throw error;
    }
  }

  async eliminar(id) {
    try {
      const eliminado = await this.ventaRepository.eliminar(id);
      if (!eliminado) {
        throw new Error("No se pudo eliminar la venta.");
      }
      return eliminado;
    } catch (error) {
      console.error("Error en servicio eliminar:", error);
      throw error;
    }
  }

  

}
 