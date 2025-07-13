import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Cliente from "./cliente-model.js";
import Producto from "./poductos-model.js";
import PedidoProducto from "./pedido-producto-model.js";

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cliente,
        key: "id",
      },
    },

  

    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    direccion_envio: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fecha_pedido: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },

    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "preparacion",
        "terminado",
        "cancelado"
      ),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    timestamps: true,
  
  }
);
// Método para calcular el total
Pedido.prototype.calcularTotal = async function () {
  const items = await PedidoProducto.findAll({
    where: { pedido_id: this.id },
  });
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  await this.update({ total });
  return total;
};

Pedido.belongsTo(Cliente, { foreignKey: "id_cliente" });
Pedido.belongsToMany(Producto, {
  through: PedidoProducto,
  foreignKey: "pedido_id",
  otherKey: "producto_id",
});

Cliente.hasMany(Pedido, { foreignKey: "id_cliente" });
Producto.belongsToMany(Pedido, {
  through: PedidoProducto,
  foreignKey: "producto_id",
  otherKey: "pedido_id",
});

export default Pedido;
