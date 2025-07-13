import Cliente from "../models/cliente-model.js"

export class ClienteService {
  async ObtenerTodosLosClientes() {
    return await Cliente.findAll()
  }
 
  async obtenerClientePorId(id) {
    const cliente = await Cliente.findByPk(id)
    if (!cliente) throw new Error("Cliente no encontrado")
    return cliente
  }

  async crearCliente(clienteData) {
    return await Cliente.create(clienteData)
  }

  async actualizarCliente(id, clienteData) {
    const cliente = await this.obtenerClientePorId(id)
    return await cliente.update(clienteData)
  }

  async eliminarCliente(id) {
    const cliente = await this.obtenerClientePorId(id)
    await cliente.destroy()
    return { mensaje: "Cliente eliminado exitosamente" }
  }

  async cambiarEstadoCliente(id, estado) {
    const cliente = await this.obtenerClientePorId(id)
    return await cliente.update({ estado })
  }
} 