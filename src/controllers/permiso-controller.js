import PermisoService from "../services/permiso-service.js";

const permisoService = new PermisoService();

export const obtenerPermisos = async (req, res) => {
  try {
    const permisos = await permisoService.obtenerTodosLosPermisos();
    res.json({ exito: true, permisos });
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ exito: false, mensaje: "Error al obtener permisos" });
  }
};

export const obtenerPermisoId = async (req, res) => {
  const { id } = req.params;
  console.log("xxxxxxxxxxxxx", id);
  try {
    const permiso = await permisoService.obtenerPermisoPorId(id);

    if (!permiso) {
      return res.status(404).json({ exito: false, mensaje: "Permiso no encontrado" });
    }
    res.json({ exito: true, permiso });
  } catch (error) {
    console.error("Error al obtener permiso por ID:", error);
    res.status(500).json({ exito: false, mensaje: "Error al obtener permiso" });
  }
}

export const obtenerPermisosPorRol = async (req, res) => {
  const { idRol } = req.params;

  try {
    const permisos = await permisoService.obtenerPermisosPorRol(idRol);

    if (!permisos) {
      return res.status(404).json({ exito: false, mensaje: "Permisos no encontrados" });
    }

    res.json({ exito: true, permisos });
  } catch (error) {
    console.error("Error al obtener permisos por rol:", error);
    res.status(500).json({ exito: false, mensaje: "Error al obtener permisos por rol" });
  }
};


export const crearPermiso = async (req, res) => {
  const { id, recurso, accion } = req.body;

  try {
    // Verificar si el permiso ya existe
    // Crear el permiso
    const nuevoPermiso = await permisoService.crearPermiso({
      id,
      recurso,
      accion,
      activo: true
    });

    res.status(201).json({
      exito: true,
      mensaje: "Permiso creado exitosamente",
      permiso: nuevoPermiso
    });
  } catch (error) {
    console.error("Error al crear permiso:", error);
    res.status(500).json({ exito: false, mensaje: "Error al crear permiso", error: error.message });
  }
};

export const actualizarPermiso = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  try {
    const permisoActualizado = await permisoService.actualizarPermiso(id, { activo });

    if (!permisoActualizado) {
      return res.status(404).json({ exito: false, mensaje: "Permiso no encontrado" });
    }

    res.json({
      exito: true,
      mensaje: "Permiso actualizado exitosamente",
      permiso: permisoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    res.status(500).json({ exito: false, mensaje: "Error al actualizar permiso" });
  }
};

export const eliminarPermiso = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await permisoService.eliminarPermiso(id);

    if (!resultado) {
      return res.status(404).json({ exito: false, mensaje: "Permiso no encontrado" });
    }

    res.json({ exito: true, mensaje: "Permiso eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    res.status(500).json({ exito: false, mensaje: "Error al eliminar permiso" });
  }
};