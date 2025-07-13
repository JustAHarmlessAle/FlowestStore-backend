import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Rol from './rol-model.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_rol: {  // Cambio para coincidir con la BD
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Rol, key: 'id' },
  },
});

Usuario.belongsTo(Rol, { foreignKey: "rol_id" });


export default Usuario;