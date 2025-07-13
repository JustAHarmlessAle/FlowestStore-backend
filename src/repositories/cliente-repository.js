import Cliente from "../models/cliente-model.js"

export const obtenerPorEstado = async() => {
  return await Cliente.findAll({ where: { estado: "activo" } })
}

export class ClienteRepository {
  async obtenerTodos() {
    return await Cliente.findAll({
      order: [["id", "DESC"]],
    })
  }
 
  async obtenerPorId(id) {
    return await Cliente.findByPk(id)
  }
 
  async obtenerPorEmail(email) { 
    return await Cliente.findOne({ where: { correoElectronico: email } })
  }

  async obtenerPorDocumento(documento) {
    return await Cliente.findOne({ where: { documentoIdentidad: documento } })
  }
  async obtenerPorTelefono(telefono) {
    return await Cliente.findOne({ where: { telefono: telefono } })
  }


  async crear(clienteData) {
    return await Cliente.create(clienteData)
  }
  
  async actualizar(id, clienteData) {
    const cliente = await Cliente.findByPk(id)
    if (!cliente) return null

    return await cliente.update(clienteData)
  }

  async eliminar(id) {
    const cliente = await Cliente.findByPk(id)
    if (!cliente) return false

    await cliente.destroy()
    return true
  }

  async cambiarEstado(id, estado) {
    const cliente = await Cliente.findByPk(id)
    if (!cliente) return null

    return await cliente.update({ estado })
  }
}

