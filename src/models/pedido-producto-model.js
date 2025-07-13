import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Producto from "./poductos-model.js";

const PedidoProducto = sequelize.define(
  "PedidoProducto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_unitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    hooks: {
      async beforeCreate(instance) {
        if (!instance.precio_unitario) {
          const producto = await Producto.findByPk(instance.producto_id);
          if (!producto) throw new Error("Producto no encontrado");
          instance.precio_unitario = producto.precio;
          instance.subtotal = instance.cantidad * instance.precio_unitario;
        }
      },
      async beforeUpdate(instance) {
        if (instance.changed("cantidad") || !instance.precio_unitario) {
          const producto = await Producto.findByPk(instance.producto_id);
          if (!producto) throw new Error("Producto no encontrado");
          instance.precio_unitario = producto.precio;
          instance.subtotal = instance.cantidad * instance.precio_unitario;
        }
      },
    },
  }
);

export default PedidoProducto;
