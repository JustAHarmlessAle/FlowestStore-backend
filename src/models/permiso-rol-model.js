import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const PermisoRol = sequelize.define(
  "PermisoRol",
  {
    rol_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    },
    permiso_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "permisos",
        key: "id",
      },
    },
  },
  {
    tableName: "permiso_rol",
    timestamps: false,
  }
);

export default PermisoRol;
