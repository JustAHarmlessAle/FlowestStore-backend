import { ProductoService } from "../services/producto-services.js"


const productoService = new ProductoService()

export async function obtenerProductos(req, res) {
  try {
    const productos = await productoService.obtenerProducto()
    res.status(200).json({ exito: true, data: productos })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function obtenerProductoPorID(req, res) {
  try {
    const { id } = req.params
    const producto = await productoService.obtenerProductoPorId(id)

    if (!producto) {
      return res.status(404).json({ exito: false, mensaje: "Producto no encontrado" })
    }

    res.status(200).json({ exito: true, data: producto })
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message })
    }
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" })
  }
}

export async function crearProductos(req, res) {  
  try {
    const { nombre, precio, estado,  descripcion, Id_Categoria } = req.body;

    if (!nombre || !precio || !estado || !descripcion || !Id_Categoria) {
      return res.status(400).json({  
        exito: false,
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const productoData = {
      nombre,
      precio,
      estado,
      descripcion,
      Id_Categoria,
       creadoPor: req.usuario?.id || null,
    };

    const nuevoProducto = await productoService.crearProducto(productoData); 

    return res.status(201).json({  
      exito: true,
      data: nuevoProducto,
      mensaje: "Producto creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({  
      exito: false,
      mensaje: "Error al crear el producto",
      error: error.message,
    });
  }
}


export async function actualizarProductos(req, res) {
  try {
    const { id } = req.params
    const productoData = req.body

    // Validar si req.usuario está definido antes de acceder a id
    productoData.actualizadoPor = req.usuario?.id || null

    // 🔹 Llamar correctamente a la función del servicio
    const productoActualizado = await productoService.actualizarProducto(id, productoData)

    res.status(200).json({
      exito: true,
      data: productoActualizado,
      mensaje: "Producto actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar el producto",
      error: error.message,
    })
  }
}

export const eliminarProductos = async (req, res) => {
  try {
    const id = Number(req.params.id); // 👈 conversión clave
    const resultado = await productoService.eliminarProducto(id);
    res.json(resultado);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: error.message });
  }
};
