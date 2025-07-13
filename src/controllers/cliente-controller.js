import { ClienteService } from "../services/cliente-service.js"

const clienteService = new ClienteService()

export async function obtenerTodosLosClientes(req, res) {
  try {
    const clientes = await clienteService.ObtenerTodosLosClientes()
    res.status(200).json({ exito: true, data: clientes })
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function obtenerClientePorId(req, res) {
  try {
    const { id } = req.params
    const cliente = await clienteService.obtenerClientePorId(id)

    if (!cliente) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" })
    }

    res.status(200).json({ exito: true, data: cliente })
  } catch (error) {
    console.error("Error al obtener cliente por ID:", error)
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function crearCliente(req, res) {
  try {
    const clienteData = req.body
    
    // Agregar información del usuario que crea el cliente
    clienteData.creadoPor = req.usuario.id

    const nuevoCliente = await clienteService.crearCliente(clienteData)
    res.status(201).json({
      exito: true,
      data: nuevoCliente,
      mensaje: "Cliente creado exitosamente",
    })
  } catch (error) {
    console.error("Error al crear cliente:", error)
    if (error.message && error.message.includes("Ya existe un cliente")) {
      return res.status(400).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function actualizarCliente(req, res) {
  try {
    const { id } = req.params
    const clienteData = req.body

    // Agregar información del usuario que actualiza el cliente
    clienteData.actualizadoPor = req.usuario.id

    const clienteActualizado = await clienteService.actualizarCliente(id, clienteData)

    if (!clienteActualizado) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" })
    }

    res.status(200).json({ exito: true, data: clienteActualizado })
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message })
    }
    if (error.message && error.message.includes("Ya existe un cliente")) {
      return res.status(400).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function eliminarCliente(req, res) {
  try {
    const { id } = req.params
    const resultado = await clienteService.eliminarCliente(id)

    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" })
    }

    res.status(200).json({
      exito: true,
      data: resultado,
      mensaje: "Cliente eliminado correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function cambiarEstadoCliente(req, res) {
  try {
    const { id } = req.params
    const { estado } = req.body

    // Validar que el estado sea válido
    if (!["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({ exito: false, mensaje: "Estado inválido. Debe ser 'activo' o 'inactivo'" })
    }

    const clienteActualizado = await clienteService.cambiarEstadoCliente(id, estado)

    if (!clienteActualizado) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" })
    }

    res.status(200).json({
      exito: true,
      data: clienteActualizado,
      mensaje: `Estado del cliente actualizado a '${estado}'`,
    })
  } catch (error) {
    console.error("Error al cambiar estado de cliente:", error)
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message })
    }
    if (error.message && error.message.includes("Estado inválido")) {
      return res.status(400).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

