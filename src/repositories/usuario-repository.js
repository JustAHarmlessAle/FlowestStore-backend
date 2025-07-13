import Usuario from "../models/usuario-model.js";

export class UsuarioRepository {
  async obtenerTodos() {
    return await Usuario.findAll({ order: [["id", "DESC"]] });
  }
  async obtenerpermisosDelUsuario(id) {
    return await Usuario.findByPk(id);
  }

  async obtenerPorId(id) {
    return await Usuario.findByPk(id);
  }

  async obtenerPorEmail(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async crear(usuarioData) {
    return await Usuario.create(usuarioData);
  }

  async actualizar(id, usuarioData) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    return await usuario.update(usuarioData);
  }

  async eliminar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
  }

  async cambiarRol(id, id_rol) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    return await usuario.update({ id_rol });
  }
}