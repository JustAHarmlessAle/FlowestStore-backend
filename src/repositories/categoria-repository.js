import { where } from "sequelize";
import Category from "../models/category.js";

export class category{
    async obtenerTodasCategories(){
        return await Category.findAll({
            order: [["id,", "DESC"]],
        })
    }

    async obtenerPorId(id){
    return await Category.findByPk(id)
    }

    async crear(crearCategories){
        return await Category.create({crearCategories})
    }

    async actualizar(id, categoryData ){
     const category = await Category.findByPk(id)
     if (!category) return null
     
     return await category.update(categoryData)
    }

    async eliminar(id){
        const category = await Category.findByPk(id)
        if (!category) return false
        await category.destroy()
        return true
    }
}