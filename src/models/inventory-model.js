import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre_producto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    precio_compra: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    precio_venta: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    fecha_ultima_modificacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: true,
  }
);

export default Inventory;

