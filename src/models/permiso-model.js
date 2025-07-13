import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"




const Permiso = sequelize.define(
  "Permiso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recurso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "permisos",
    timestamps: true,
  },
)



export default Permiso
