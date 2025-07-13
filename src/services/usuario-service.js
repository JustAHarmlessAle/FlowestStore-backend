import { UsuarioRepository } from "../repositories/usuario-repository.js";
import  Rol  from "../models/rol-model.js";
import  Permiso  from "../models/permiso-model.js";

const usuarioRepository = new UsuarioRepository();

export default class UsuarioService {


  async obtenerPermisosPorUsuario(idUsuario) {
    const usuario = await this.obtenerUsuarioPorId(idUsuario);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    // Obtener el rol del usuario
    const rol = await Rol.findByPk(usuario.id_rol, {
      include: {
        model: Permiso,
        through: { attributes: [] }, // Excluir atributos de la tabla intermedia
      },
    });
    
    if (!rol) {
      throw new Error('Rol no encontrado');
    }
    
    // Devolver los permisos asociados al rol
    return rol.Permisos;
  }

  async obtenerTodosLosUsuarios() {
    return await usuarioRepository.obtenerTodos();
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await usuarioRepository.obtenerPorId(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  }

  async obtenerUsuarioPorEmail(email) {
    return await usuarioRepository.obtenerPorEmail(email) || null;
  }

  async crearUsuario(usuarioData) {
    return await usuarioRepository.crear(usuarioData);
  }

  async actualizarUsuario(id, usuarioData) {
    const usuario = await usuarioRepository.obtenerPorId(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return await usuarioRepository.actualizar(id, usuarioData);
  }

  async eliminarUsuario(id) {
    const eliminado = await usuarioRepository.eliminar(id);
    if (!eliminado) throw new Error("Usuario no encontrado");
    return { mensaje: "Usuario eliminado exitosamente" };
  }

  async cambiarRolUsuario(id, id_rol) {
    const usuario = await usuarioRepository.obtenerPorId(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return await usuarioRepository.cambiarRol(id, id_rol);
  }

  
}