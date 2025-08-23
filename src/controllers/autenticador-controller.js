import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import UsuarioService from "../services/usuario-service.js";
import { ClienteService } from "../services/cliente-service.js";
import { generarToken } from "../utils/jwt.js";
import Rol from "../models/rol-model.js";
import Permiso from "../models/permiso-model.js";

dotenv.config();

const usuarioService = new UsuarioService();
const clienteService = new ClienteService();

//  **Iniciar Sesión**
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await usuarioService.obtenerUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password);

    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Obtener permisos del rol del usuario
    const permisos = await usuarioService.obtenerPermisosPorUsuario(usuario.id);

    const claims = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      id_rol: usuario.id_rol,
      tipo: "usuario",
    };

    // Generar token JWT
    const token = generarToken(claims);

    // Configuración de cookies
    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hora
      path: "/",
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
    }

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        id_rol: usuario.id_rol,
        permisos: permisos.map((permiso) => permiso.recurso), // Solo devolver los recursos como ejemplo
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      mensaje: "Error interno al iniciar sesión",
      error: error.message,
    });
  }
};
// Ruta para devolver el usuario autenticado
export const obtenerUsuarioAutenticado = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ exito: false, mensaje: "No autenticado" });
    }

    console.log("Usuario autenticado:", req.usuario.tipo);

    let data = null;

    if (req.usuario.tipo === "cliente") {
      const clienteEncontrado = await clienteService.obtenerClientePorId(req.usuario.id);

      if (!clienteEncontrado) {
        return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" });
      }

      data = {
        id: clienteEncontrado.id,
        nombre: clienteEncontrado.nombreCompleto,
        email: clienteEncontrado.correoElectronico,
        cedula: clienteEncontrado.documentoIdentidad,
        telefono: clienteEncontrado.telefono,
        direccion: clienteEncontrado.direccion,
      };

    } else if (req.usuario.tipo === "usuario") {
      const usuarioEncontrado = await usuarioService.obtenerUsuarioPorId(req.usuario.id);

      if (!usuarioEncontrado) {
        return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado" });
      }

      data = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        id_rol: usuarioEncontrado.id_rol,
      };
    } else {
      return res.status(400).json({ exito: false, mensaje: "Tipo de usuario inválido" });
    }

    return res.status(200).json({
      exito: true,
      data,
    });

  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error en el servidor",
    });
  }
};


// Cerrar sesión
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res
    .status(200)
    .json({ exito: true, mensaje: "Sesión cerrada correctamente" });
};

// ✅ **Obtener todos los usuarios**
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios();

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ mensaje: "No hay usuarios registrados" });
    }

    res.json({
      mensaje: "Lista de usuarios registrados",
      usuarios: usuarios.map((usuario) => ({
        id: usuario.id,
        estado: usuario.estado,
        nombre: usuario.nombre,
        email: usuario.email,
        id_rol: usuario.id_rol,
        cedula: usuario.cedula,
      })),
    });
  } catch (error) {
    console.error("Error al obtener usuarios registrados:", error);
    res.status(500).json({
      mensaje: "Error interno al obtener usuarios",
      error: error.message,
    });
  }
};

// ✅ **Obtener un usuario por ID**
export const obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      id_rol: usuario.id_rol,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error interno al obtener usuario" });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Si se está actualizando la contraseña, encriptarla
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const usuarioActualizado = await usuarioService.actualizarUsuario(id, data);

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error interno al actualizar usuario" });
  }
};

// ✅ **Eliminar usuario**
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEliminado = await usuarioService.eliminarUsuario(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar usuario" });
  }
};

export const crearUsuarioController = async (req, res) => {
  try {
    const { nombre, email, password, id_rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      nombre,
      email,
      password: hashedPassword,
      id_rol,
      cedula: req.body.cedula,
      estado: req.body.estado || "activo", // Asignar "activo" por defecto si no se proporciona
    };
    const usuarioCreado = await usuarioService.crearUsuario(nuevoUsuario);
    res.status(200).json(usuarioCreado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno al crear un usuario" });
  }
};
