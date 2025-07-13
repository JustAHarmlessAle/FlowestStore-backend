import { PermisoRepository } from "../repositories/permiso-repository.js"

const permisoRepository = new PermisoRepository()

// Cambiamos a export default para que funcione la importación
export default class PermisoService {
  async obtenerTodosLosPermisos() {
    return await permisoRepository.obtenerTodosLosPermisos()
  }

  async obtenerPermisoPorId(id) {
    return await permisoRepository.obtenerPermisoPorId(id)
  }

  async crearPermiso(permisoData) {
    return await permisoRepository.crearPermiso(permisoData)
  }

  async actualizarPermiso(id, permisoData) {
    return await permisoRepository.actualizarPermiso(id, permisoData)
  }

  async eliminarPermiso(id) {
    return await permisoRepository.eliminarPermiso(id)
  }
  async obtenerPermisosPorRol(idRol) {
    return await permisoRepository.obtenerPermisosPorRol(idRol)
  }

}
