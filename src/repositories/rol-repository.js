import Rol from "../models/rol-model.js"
import Permiso from "../models/permiso-model.js"

export class RolRepository {

  async obtenerTodosLosRoles () {
    return await Rol.findAll({
      include: [
        {
          model: Permiso,
          attributes: ["id", "recurso", "accion", "activo"],
        // Cambiado para usar 'Permisos' con mayúscula
        },
      ],
    })
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


  async crearRol(rolData, options = {}) {
    return await Rol.create(rolData, options)
  }

  async actualizarRol(id, rolData) {
    const rol = await Rol.findByPk(id)
    if (!rol) return null
    await rol.update(rolData)
    return rol
  }
  async cambiarEstadoRol(id, estado) {
    const rol = await Rol.findByPk(id)
    if (!rol) return null
    await rol.update({ activo })
    return rol
  }
  async eliminarRol(id) {
    const rol = await Rol.findByPk(id)
    if (!rol) return false
    await rol.destroy()
    return true
  }

 
  
}
