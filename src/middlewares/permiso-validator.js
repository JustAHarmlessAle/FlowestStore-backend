import Usuario from "../models/usuario-model.js";
import Rol from "../models/rol-model.js";
import PermisoService from "../services/permiso-service.js";

const permisoService = new PermisoService();

export const verificarPermiso = (recurso, accion) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.user?.id || req.usuario?.id || req.Rol?.id;

      console.log("Middleware verificarPermiso -> usuarioId:", usuarioId);

      if (!usuarioId) {
        return res.status(401).json({
          exito: false,
          mensaje: "No autorizado. Usuario no identificado.",
        });
      }

      const usuario = await Usuario.findOne({
        where: { id: usuarioId },
        include: [{ model: Rol, attributes: ["nombre"] }],
      });

      if (!usuario || !usuario.Rol) {
        return res.status(403).json({
          exito: false,
          mensaje: "Acceso denegado. Usuario o rol no encontrado.",
        });
      }

      // ✅ Si es administrador, permitimos el acceso
      if (usuario.Rol.nombre === "administrador") {
        return next();
      }

      // 🔐 Verificamos si tiene el permiso
      const permisos = await permisoService.obtenerPorUsuario(usuarioId);

      const permisoValido = permisos.some(
        (permiso) =>
          permiso.recurso === recurso &&
          permiso.accion === accion &&
          permiso.activo
      );

      if (permisoValido) {
        return next();
      }

      return res.status(403).json({
        exito: false,
        mensaje: `Acceso denegado. No tienes permiso para ${accion} en ${recurso}.`,
      });
    } catch (error) {
      console.error("Error al verificar permisos:", error);
      return res.status(500).json({
        exito: false,
        mensaje: "Error interno al verificar permisos.",
        error: error.message,
      });
    }
  };
};
