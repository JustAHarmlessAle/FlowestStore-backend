import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Categoria from "./categoria-model.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo"),
      defaultValue: "activo",
    },
    Id_Categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categoria,
        key: "id",
      },
    },
    imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  },
  {
    timestamps: true,
  }
);

Producto.belongsTo(Categoria, { foreignKey: "Id_Categoria" });
Categoria.hasMany(Producto, { foreignKey: "Id_Categoria" });

export default Producto;
