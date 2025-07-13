import Categoria from "../models/categoria-model.js";

export class CategoriaServices{

async obtenerTodasLasCategorias(){
    return await Categoria.findAll()
}

async obtenerCategoriaPorId(id){
    const categoria = await Categoria.findByPk(id)
    if (!categoria) throw new Error("Categoria no encontrada")
    return categoria
    }

    async crearCategoria(categoryData){
        return await Categoria.create(categoryData)
    }

    async actualizarCategoria(id, categoryData){
        const categoria = await this.obtenerCategoriaPorId(id)
        return await categoria.update(categoryData)
    }

    async eliminarCategoria(id){
        const categoria = await this.obtenerCategoriaPorId(id)
        await categoria.destroy()
        return{mensaje:"Categoria elminada con eficiencia"}
    }

}