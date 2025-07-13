import { VentaService } from "../services/venta-service.js"

const ventaService = new VentaService()

export async function obtenerVentas(req, res) {
  try {
    const ventas = await ventaService.obtenerTodos()
    res.status(200).json({
      exito: true,
      data: ventas,
    })
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener ventas",
      error: error.message,
    })
  }
}

export async function obtenerVentaPorId(req, res) {
  try {
    const { id } = req.params
    const venta = await ventaService.obtenerPorId(id)

    if (!venta) {
      return res.status(404).json({
        exito: false,
        mensaje: "Venta no encontrada",
      })
    }

    res.status(200).json({
      exito: true,
      data: venta,
    })
  } catch (error) {
    console.error("Error al obtener venta por ID:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener la venta",
      error: error.message,
    })
  }
}

export async function crearVenta(req, res) {
  try {
    const ventaData = req.body

    // Agregar información del usuario que crea la venta si está disponible
    if (req.usuario) {
      ventaData.creadoPor = req.usuario.id
    }

    const nuevaVenta = await ventaService.crear(ventaData)
    res.status(201).json({
      exito: true,
      data: nuevaVenta,
      mensaje: "Venta creada exitosamente",
    })
  } catch (error) {
    console.error("Error al crear venta:", error)
    res.status(400).json({
      exito: false,
      mensaje: "Error al crear la venta",
      error: error.message,
    })
  }
}

export async function actualizarVenta(req, res) {
  try {
    const { id } = req.params
    const ventaData = req.body

    // Agregar información del usuario que actualiza la venta si está disponible
    if (req.usuario) {
      ventaData.actualizadoPor = req.usuario.id
    }

    const ventaActualizada = await ventaService.actualizar(id, ventaData)

    if (!ventaActualizada) {
      return res.status(404).json({
        exito: false,
        mensaje: "Venta no encontrada",
      })
    }

    res.status(200).json({
      exito: true,
      data: ventaActualizada,
      mensaje: "Venta actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error al actualizar venta:", error)
    res.status(400).json({
      exito: false,
      mensaje: "Error al actualizar la venta",
      error: error.message,
    })
  }
}

export async function eliminarVenta(req, res) {
  try {
    const { id } = req.params
    const eliminada = await ventaService.eliminar(id)

    if (!eliminada) {
      return res.status(404).json({
        exito: false,
        mensaje: "Venta no encontrada",
      })
    }

    res.status(200).json({
      exito: true,
      mensaje: "Venta eliminada correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar venta:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar la venta",
      error: error.message,
    })
  }
}


