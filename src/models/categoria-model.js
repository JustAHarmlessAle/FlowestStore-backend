import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Categoria = sequelize.define('Categoria',{
 id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
 },
 nombre:{
    type: DataTypes.STRING,
    allowNull: false,
    unique:false
 },
 estado: {
       type: DataTypes.ENUM("activo", "inactivo"),
       defaultValue: "activo",
     },
 descripcion:{
   type: DataTypes.STRING,
   allowNull: false
 }

});


export default Categoria;

