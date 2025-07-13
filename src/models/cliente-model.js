import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

const Cliente = sequelize.define(
  "Cliente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    nombreCompleto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipoDocumento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'CC' // O el valor por defecto que prefieras
    },
    documentoIdentidad: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false,
    },
    correoElectronico: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
      validate: { 
        isEmail: true,
      },
    }, 
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    genero: {
      type: DataTypes.ENUM("masculino", "femenino", "otro"),
      allowNull: false,
    },
 
    fechaRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo"),
      defaultValue: "activo",
    },
  },
  { 
    timestamps: true,
    tableName: "clientes",
  },
)

export default Cliente