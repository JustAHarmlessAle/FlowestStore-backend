import { sequelize } from "../config/database.js"
import Permiso from "../models/permiso-model.js" 
import Rol from "../models/rol-model.js"
import PermisoRol from "../models/permiso-rol-model.js" // Corregida la importación

export class RolService {
  async obtenerTodosLosRoles() {
    return await Rol.findAll({
      include: [
        {
          model: Permiso,
          attributes: ["id", "recurso", "accion", "activo"],
        },
      ],
    })
  }
  
  async obtenerRolesConPermisos() {
    return await this.obtenerTodosLosRoles();
  }
  
  async obtenerRolPorId(id) {
    return await Rol.findByPk(id, {
      include: [
        {
          model: Permiso,
          attributes: ["id", "recurso", "accion", "activo"],
        },
      ],
    })
  }

  async crearRol(rolData) {
    const { nombre, permisos } = rolData;
    const transaction = await sequelize.transaction();

    try {
      // Crear el rol
      const nuevoRol = await Rol.create({ nombre }, { transaction });

      // Asociar permisos existentes al nuevo rol
      for (const permisoId of permisos) {
        await PermisoRol.create(
          { rol_id: nuevoRol.id, permiso_id: permisoId },
          { transaction }
        );
      }

      await transaction.commit();
      return await this.obtenerRolPorId(nuevoRol.id);
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      throw new Error("Error al crear el rol: " + error.message);
    }
  }

  async actualizarRol(id, rolData) {
    const { nombre, permisos } = rolData;
    const transaction = await sequelize.transaction();

    try {
      // Actualizar el rol
      const rol = await this.obtenerRolPorId(id);
      if (!rol) return null;

      await Rol.update({ nombre }, { where: { id }, transaction });

      // Eliminar permisos existentes
      await PermisoRol.destroy({ where: { rol_id: id }, transaction });

      // Asociar nuevos permisos al rol
      for (const permisoId of permisos) {
        await PermisoRol.create(
          { rol_id: id, permiso_id: permisoId },
          { transaction }
        );
      }

      await transaction.commit();
      return await this.obtenerRolPorId(id);
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      throw new Error("Error al actualizar el rol: " + error.message);
    }
  }

   async cambiarEstadoRol(id, estado) {
    try {
      const rol = await this.obtenerRolPorId(id)
      if (!rol) return null

      await Rol.update({ estado }, { where: { id } })
      return await this.obtenerRolPorId(id)
    } catch (error) {
      throw new Error("Error al cambiar el estado del rol: " + error.message)
    }
  }

  async activarRol(id) {
    return await this.cambiarEstadoRol(id, true)
  }

  async desactivarRol(id) {
    return await this.cambiarEstadoRol(id, false)
  }
  
  async eliminarRol(id) {
    const rol = await this.obtenerRolPorId(id);
    if (!rol) return null;

    await PermisoRol.destroy({ where: { rol_id: id } }); // Corregido permiso_id a rol_id
    await Rol.destroy({ where: { id } });
    return { mensaje: "Rol eliminado exitosamente" };
  }
}