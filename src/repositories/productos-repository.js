import Producto from "../models/poductos-model.js";
import Categoria from "../models/categoria-model.js";

export class ProductoRepository{
    async obtenertodos(){
        return await Producto.findAll({
            include:[{
                model: Categoria,
                as: "categoria",
                attributes:["id","nombre"]
            }],
            order:[["id","DESC"]],
        })
    }
    async obtenerPorId(id){
        return await Producto.findByPk(id)
    }

    async obtenerPorNombre(nombre){
        return await Producto.findOne({where:{NOMBRE:nombre}})
    }

    async crear(productoData){
        return await Producto.create(productoData)
    }

    async actualizar(id, productoData){
        const producto= await Producto.findByPk(id)
        if(!producto) return null
        
        return await producto.update(productoData)
    }

    async eliminar(id){
        const producto = await Producto.findByPk(id)
        if (!producto) return false

        await producto.destroy()
        return true
    }
}