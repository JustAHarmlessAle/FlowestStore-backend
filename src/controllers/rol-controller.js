import { RolService } from "../services/rol-service.js"

const rolService = new RolService()

export async function obtenerTodosLosRoles(req, res) {
  try {
    const roles = await rolService.obtenerTodosLosRoles()
    res.status(200).json({ exito: true, data: roles })
  } catch (error) {
    console.error("Error al obtener roles:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function obtenerRolesConPermisos(req, res) {
  try {
    const roles = await rolService.obtenerRolesConPermisos()
    res.status(200).json({ exito: true, data: roles })
  } catch (error) {
    console.error("Error al obtener roles con permisos:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function obtenerRolPorId(req, res) {
  try {
    const { id } = req.params
    const rol = await rolService.obtenerRolPorId(id)

    if (!rol) {
      return res.status(404).json({ exito: false, mensaje: "Rol no encontrado" })
    }

    res.status(200).json({ exito: true, data: rol })
  } catch (error) {
    console.error("Error al obtener rol por ID:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function crearRol(req, res) {
  try {
    const rolData = req.body

    // Eliminamos esta validación manual ya que ahora se maneja con express-validator
    // if (!rolData.nombre) {
    //   return res.status(400).json({
    //     exito: false,
    //     mensaje: "El nombre del rol es obligatorio",
    //   });
    // }

    const nuevoRol = await rolService.crearRol(rolData)
    res.status(201).json({ exito: true, data: nuevoRol, mensaje: "Rol creado exitosamente" })
  } catch (error) {
    console.error("Error al crear rol:", error.message)
    res.status(400).json({ exito: false, mensaje: error.message })
  }
}

export async function actualizarRol(req, res) {
  try {
    const { id } = req.params
    const rolData = req.body

    const rolActualizado = await rolService.actualizarRol(id, rolData)

    res.status(200).json({ exito: true, data: rolActualizado, mensaje: "Rol actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar rol:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}
export async function cambiarEstadoRol(req, res) {
  try {
    const { id } = req.params
    const { estado } = req.body

    if (typeof estado !== "boolean") {
      return res.status(400).json({
        exito: false,
        mensaje: "El campo 'activo' debe ser un valor booleano",
      })
    }

    const rolActualizado = await rolService.cambiarEstadoRol(id, estado)

    if (!rolActualizado) {
      return res.status(404).json({ exito: false, mensaje: "Rol no encontrado" })
    }

    const mensaje = estado ? "Rol activado correctamente" : "Rol desactivado correctamente"
    res.status(200).json({ exito: true, data: rolActualizado, mensaje })
  } catch (error) {
    console.error("Error al cambiar estado del rol:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function activarRol(req, res) {
  try {
    const { id } = req.params
    const rolActivado = await rolService.activarRol(id)

    if (!rolActivado) {
      return res.status(404).json({ exito: false, mensaje: "Rol no encontrado" })
    }

    res.status(200).json({ exito: true, data: rolActivado, mensaje: "Rol activado correctamente" })
  } catch (error) {
    console.error("Error al activar rol:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function desactivarRol(req, res) {
  try {
    const { id } = req.params
    const rolDesactivado = await rolService.desactivarRol(id)

    if (!rolDesactivado) {
      return res.status(404).json({ exito: false, mensaje: "Rol no encontrado" })
    }

    res.status(200).json({ exito: true, data: rolDesactivado, mensaje: "Rol desactivado correctamente" })
  } catch (error) {
    console.error("Error al desactivar rol:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function eliminarRol(req, res) {
  try {
    const { id } = req.params

    const resultado = await rolService.eliminarRol(id)
    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: "Rol no encontrado" })
    }

    res.status(200).json({ exito: true, mensaje: "Rol eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar rol:", error.message)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}
