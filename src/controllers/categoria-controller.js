import { CategoriaServices } from "../services/categoria-services.js";
import { validationResult } from 'express-validator';
const categoryServices = new CategoriaServices();

//Middleware para verificar autenticación
const checkAuth = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: "No autorizado. Debe iniciar sesión." 
    });
  }
  next();
};

export async function obtenerTodasLasCategorias(req, res) {
  try {
    const categorias = await categoryServices.obtenerTodasLasCategorias();
    res.status(200).json({ 
      exito: true, 
      data: categorias 
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ 
      exito: false, 
      mensaje: "Error interno al obtener categorías" 
    });
  }
}

export async function obtenerCategoriaPorId(req, res) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: "ID de categoría no proporcionado" 
      });
    }

    const categoria = await categoryServices.obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({ 
        exito: false, 
        mensaje: "Categoría no encontrada" 
      });
    }

    res.status(200).json({ 
      exito: true, 
      data: categoria 
    });
  } catch (error) {
    console.error("Error al obtener categoría por ID:", error);
    res.status(500).json({ 
      exito: false, 
      mensaje: "Error interno al obtener la categoría" 
    });
  }
}

export async function crearCategoria(req, res) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
  }
  try {
    // Verificar autenticación primero
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: "No autorizado. Usuario no identificado." 
      });
    }

    const { nombre, descripcion, estado } = req.body;

    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: "El nombre de la categoría es requerido" 
      });
    }

    const categoryData = {
      nombre,
      descripcion: descripcion || "",
      estado: estado || "activo",
      // creadoPor: req.usuario.id
    };

    const nuevaCategoria = await categoryServices.crearCategoria(categoryData);
    
    res.status(201).json({
      exito: true,
      data: nuevaCategoria,
      mensaje: "Categoría creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    
    if (error.message && error.message.includes("ya existe una categoria")) {
      return res.status(409).json({ 
        exito: false, 
        mensaje: "Ya existe una categoría con ese nombre" 
      });
    }
    
    res.status(500).json({ 
      exito: false, 
      mensaje: "Error interno al crear la categoría" 
    });
  }
}

export async function actualizarCategoria(req, res) {
  try {
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ 
        exito: false, 
        mensaje: "No autorizado. Usuario no identificado." 
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: "ID de categoría no proporcionado" 
      });
    }

    const { nombre, descripcion, estado } = req.body; // ✅ Agregado aquí

    if (!nombre && !descripcion && !estado) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: "Debe proporcionar al menos un campo para actualizar" 
      });
    }

    const updateData = {
      ...(nombre && { nombre }),
      ...(descripcion && { descripcion }),
      ...(estado && { estado }),
      actualizadoPor: req.usuario.id,
      fechaActualizacion: new Date()
    };

    console.log("Actualizando categoría con:", updateData); // ✅ Opcional para debug

    const categoriaActualizada = await categoryServices.actualizarCategoria(id, updateData);

    if (!categoriaActualizada) {
      return res.status(404).json({ 
        exito: false, 
        mensaje: "Categoría no encontrada" 
      });
    }

    res.status(200).json({
      exito: true,
      data: categoriaActualizada,
      mensaje: "Categoría actualizada correctamente"
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    
    if (error.message && error.message.includes("Ya existe una categoria igual")) {
      return res.status(409).json({ 
        exito: false, 
        mensaje: "Ya existe una categoría con ese nombre" 
      });
    }

    res.status(500).json({ 
      exito: false, 
      mensaje: "Error interno al actualizar la categoría" 
    });
  }
}


export async function eliminarCategoria(req, res) {
  try {
    const { id } = req.params;

    // Validación básica
    if (!id) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: "ID de categoría no proporcionado" 
      });
    }

    const resultado = await categoryServices.eliminarCategoria(id);

    if (!resultado) {
      return res.status(404).json({ 
        exito: false, 
        mensaje: "Categoría no encontrada" 
      });
    }

    res.status(200).json({
      exito: true,
      data: { id },
      mensaje: "Categoría eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    
    if (error.message && error.message.includes("Categoria no encontrada")) {
      return res.status(404).json({ 
        exito: false, 
        mensaje: error.message 
      });
    }
    
    // Manejo de error si la categoría tiene productos asociados
    if (error.message && error.message.includes("tiene productos asociados")) {
      return res.status(400).json({ 
        exito: false, 
        mensaje: error.message 
      });
    }
    
    res.status(500).json({ 
      exito: false, 
      mensaje: "Error interno al eliminar la categoría" 
    });
  }
}