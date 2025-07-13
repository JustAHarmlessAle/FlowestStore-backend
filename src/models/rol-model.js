import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Permiso from "./permiso-model.js";
import PermisoRol from "./permiso-rol-model.js";

const Rol = sequelize.define(
  "Rol",
  {
    id: {
      type: DataTypes.INTEGER, // Corregido de INT a INTEGER
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

// Corregidas las relaciones
Rol.belongsToMany(Permiso, {
  through: PermisoRol,
  foreignKey: "rol_id",
  otherKey: "permiso_id",
});

Permiso.belongsToMany(Rol, {
  through: PermisoRol,
  foreignKey: "permiso_id",
  otherKey: "rol_id",
});

export default Rol;
