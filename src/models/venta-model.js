import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Pedido from "./pedido-model.js";
import Cliente from "./cliente-model.js"; // Asegúrate de importar el modelo Cliente
import Producto from "./poductos-model.js"; // Asegúrate de importar el modelo Producto
import PedidoProducto from "./pedido-producto-model.js";

const Venta = sequelize.define(
  "Venta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pedido,
        key: "id",
      },
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_pagar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.ENUM("efectivo", "transferencia"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Relaciones
Venta.belongsTo(Pedido, { foreignKey: "id_pedido" });
Pedido.hasOne(Venta, { foreignKey: "id_pedido" });

export default Venta;