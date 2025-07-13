import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
import Usuario from "./usuario-model.js"

const CodigoRecuperacion = sequelize.define(
  "CodigoRecuperacion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Usuario, key: "id" },
    },
    codigo: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    utilizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  },
)

// Relación con Usuario
CodigoRecuperacion.belongsTo(Usuario, { foreignKey: "usuario_id" })

export default CodigoRecuperacion
