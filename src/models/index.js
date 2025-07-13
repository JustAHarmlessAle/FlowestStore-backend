import { sequelize } from "../config/database.js"
import Cliente from "./cliente-model.js"
import Producto from "./poductos-model.js"
import Pedido from "./pedido-model.js"
import Venta from "./venta-model.js"
import  Permiso  from "./permiso-model.js"


export const models = {
  Cliente,
  Producto,
  Pedido,
  Venta,
  Permiso

  
}

export const sincronizarModelos = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("Modelos sincronizados correctamente")
  } catch (error) {
    console.error("Error al sincronizar modelos:", error)
  }
}