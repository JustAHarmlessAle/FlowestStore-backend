import { PedidoService } from "../services/pedido-service.js";

const pedidoService = new PedidoService();

export async function obtenerTodos(req, res) {
  try {
    const { estado } = req.query
    let pedidos

    if (estado === "terminado") {
      pedidos = await pedidoService.obtenerTerminados()
    } else {
      pedidos = await pedidoService.obtenerTodos()
    }

    res.json({ exito: true, data: pedidos })
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener pedidos",
      error: error.message,
    })
  }
}

export async function obtenerPorId(req, res) {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.obtenerPorId(id);

    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: "Pedido no encontrado",
      });
    }

    res.status(200).json({
      exito: true,
      data: pedido,
    });
  } catch (error) {
    console.error("Error al obtener pedido por ID:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener el pedido",
      error: error.message,
    });
  }
}

export async function crearpedidos(req, res) {  // Mantenemos el nombre original
  try {
    const pedidoData = req.body;

    if (!pedidoData.productos || !Array.isArray(pedidoData.productos) || pedidoData.productos.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: "Debe incluir al menos un producto en el pedido",
      });
    }

    const nuevoPedido = await pedidoService.crearpedidos(pedidoData);
    res.status(201).json({
      exito: true,
      data: nuevoPedido,
      mensaje: "Pedido creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(400).json({
      exito: false,
      mensaje: "Error al crear el pedido",
      error: error.message,
    });
  }
}

export async function actualizarpedidos(req, res) {  // Mantenemos el nombre original
  try {
    const { id } = req.params;
    const pedidoData = req.body;

    const pedidoActualizado = await pedidoService.actualizarpedidos(id, pedidoData);

    res.status(200).json({
      exito: true,
      data: pedidoActualizado,
      mensaje: "Pedido actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(400).json({
      exito: false,
      mensaje: "Error al actualizar el pedido",
      error: error.message,
    });
  }
}

export async function eliminarpedidos(req, res) {  // Mantenemos el nombre original
  try {
    const { id } = req.params;
    const resultado = await pedidoService.eliminarpedidos(id);
    res.status(200).json({
      exito: true,
      data: resultado,
      mensaje: "Pedido eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar el pedido",
      error: error.message,
    });
  }
}

export async function cambiarEstadopedidos(req, res) {  // Mantenemos el nombre original
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedidoActualizado = await pedidoService.cambiarEstadopedidos(id, estado);

    res.status(200).json({
      exito: true,
      data: pedidoActualizado,
      mensaje: `Estado del pedido actualizado a '${estado}'`,
    });
  } catch (error) {
    console.error("Error al cambiar estado del pedido:", error);
    res.status(400).json({
      exito: false,
      mensaje: "Error al cambiar estado del pedido",
      error: error.message,
    });
  }
  
}

// 👇 AÑADE ESTA NUEVA FUNCIÓN AL FINAL DEL ARCHIVO
export async function obtenerPedidosPorCliente(req, res) {
  try {
    const { clienteId } = req.params;
    const usuarioAutenticado = req.usuario; // Esto viene del middleware 'autenticar'

    // Medida de seguridad CRÍTICA:
    // Un usuario solo puede ver sus propios pedidos.
    // Comparamos el ID del token con el ID de la URL.
    if (usuarioAutenticado.id !== parseInt(clienteId, 10)) {
      return res.status(403).json({ exito: false, mensaje: "Acceso prohibido. No puedes ver los pedidos de otro cliente." });
    }

    const pedidos = await pedidoService.obtenerPedidosPorClienteId(clienteId);

    // Es importante devolver un array vacío si no hay pedidos, no un error.
    if (!pedidos) {
      return res.status(200).json({ exito: true, data: [] });
    }

    res.status(200).json({ exito: true, data: pedidos });
  } catch (error) {
    console.error("Error al obtener los pedidos del cliente:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
  }
}
