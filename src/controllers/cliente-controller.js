import { ClienteService } from "../services/cliente-service.js";
import bcrypt from "bcryptjs";
import { generarToken } from "../utils/jwt.js";

const clienteService = new ClienteService();

export async function obtenerTodosLosClientes(req, res) {
  try {
    const clientes = await clienteService.ObtenerTodosLosClientes();
    res.status(200).json({ exito: true, data: clientes });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function obtenerClientePorId(req, res) {
  try {
    const { id } = req.params;
    const cliente = await clienteService.obtenerClientePorId(id);

    if (!cliente) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Cliente no encontrado" });
    }
    res.status(200).json({ exito: true, data: cliente });
  } catch (error) {
    console.error("Error al obtener cliente por ID:", error);
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message });
    }
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function crearCliente(req, res) {
  try {
    const clienteData = req.body;

    // Agregar información del usuario que crea el cliente
    clienteData.creadoPor = req.usuario.id;

    const nuevoCliente = await clienteService.crearCliente({
      ...clienteData,
    });
    res.status(201).json({
      exito: true,
      data: nuevoCliente,
      mensaje: "Cliente creado exitosamente",
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    if (error.message && error.message.includes("Ya existe un cliente")) {
      return res.status(400).json({ exito: false, mensaje: error.message });
    }
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function actualizarCliente(req, res) {
  try {
    const { id } = req.params;
    let clienteData = req.body;

    // Agregar información del usuario que actualiza el cliente
    clienteData.actualizadoPor = req.usuario.id;

    clienteData = {
      ...clienteData,
    };

    const clienteActualizado = await clienteService.actualizarCliente(
      id,
      clienteData
    );

    if (!clienteActualizado) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    res.status(200).json({ exito: true, data: clienteActualizado });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message });
    }
    if (error.message && error.message.includes("Ya existe un cliente")) {
      return res.status(400).json({ exito: false, mensaje: error.message });
    }
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function eliminarCliente(req, res) {
  try {
    const { id } = req.params;
    const resultado = await clienteService.eliminarCliente(id);

    if (!resultado) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    res.status(200).json({
      exito: true,
      data: resultado,
      mensaje: "Cliente eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message });
    }
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function cambiarEstadoCliente(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    if (!["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({
        exito: false,
        mensaje: "Estado inválido. Debe ser 'activo' o 'inactivo'",
      });
    }

    const clienteActualizado = await clienteService.cambiarEstadoCliente(
      id,
      estado
    );

    if (!clienteActualizado) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    res.status(200).json({
      exito: true,
      data: clienteActualizado,
      mensaje: `Estado del cliente actualizado a '${estado}'`,
    });
  } catch (error) {
    console.error("Error al cambiar estado de cliente:", error);
    if (error.message === "Cliente no encontrado") {
      return res.status(404).json({ exito: false, mensaje: error.message });
    }
    if (error.message && error.message.includes("Estado inválido")) {
      return res.status(400).json({ exito: false, mensaje: error.message });
    }
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function registrarCliente(req, res) {
  try {
    const {
      nombreCompleto,
      tipoDocumento,
      documentoIdentidad,
      correoElectronico,
      password,
      telefono,
      direccion,
    } = req.body;
    console.log(req.body);

    // El cliente debe proporcionar una contraseña para registrarse o activar su cuenta
    if (!password) {
      return res.status(400).json({
        exito: false,
        mensaje: "La contraseña es obligatoria para el registro.",
      });
    }

    // Buscar si el cliente ya existe por correo electrónico
    const clienteExistente = await clienteService.obtenerClientePorCorreo(
      correoElectronico
    );

    // Encriptar la contraseña proporcionada
    const hashedPassword = await bcrypt.hash(password, 10);

    if (clienteExistente) {
      if (!clienteExistente.password) {
        // Si el cliente no tiene una contraseña
        return res.status(400).json({
          exito: false,
          mensaje: "El cliente ya se encuentra registrado.",
        });
      }
      // --- FLUJO DE ACTUALIZACIÓN ---
      // El correo existe, actualizamos los datos del cliente para "activar" su cuenta.
      const clienteActualizado = await clienteService.actualizarCliente(
        clienteExistente.id,
        {
          nombreCompleto,
          tipoDocumento,
          documentoIdentidad,
          correoElectronico,
          password: hashedPassword, // Se establece la nueva contraseña
          telefono,
          direccion,
          estado: "activo", // Se asegura que el estado sea activo
        }
      );

      res.status(200).json({
        exito: true,
        mensaje: "Cuenta de cliente actualizada y activada exitosamente",
        data: {
          id: clienteActualizado.id,
          nombreCompleto: clienteActualizado.nombreCompleto,
          correoElectronico: clienteActualizado.correoElectronico,
        },
      });
    } else {
      // --- FLUJO DE CREACIÓN ---
      // El correo no existe, es un cliente completamente nuevo.
      const nuevoCliente = await clienteService.crearCliente({
        nombreCompleto,
        tipoDocumento,
        documentoIdentidad,
        correoElectronico,
        password: hashedPassword,
        telefono,
        direccion,
        estado: "activo",
      });

      res.status(201).json({
        exito: true,
        mensaje: "Cliente registrado exitosamente",
        data: {
          id: nuevoCliente.id,
          nombreCompleto: nuevoCliente.nombreCompleto,
          correoElectronico: nuevoCliente.correoElectronico,
        },
      });
    }
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function loginCliente(req, res) {
  try {
    const { correoElectronico, password } = req.body;

    // Buscar cliente por correo
    const cliente = await clienteService.obtenerClientePorCorreo(
      correoElectronico
    );
    if (!cliente) {
      return res
        .status(404)
        .json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    // --- NUEVA VALIDACIÓN ---
    // Verificar si el cliente tiene una contraseña. Si no, fue creado por un admin.
    if (!cliente.password) {
      return res.status(401).json({
        exito: false,
        mensaje: "Por favor, complete el registro para activar la cuenta.",
      });
    }

    // Validar contraseña
    const esPasswordValido = await bcrypt.compare(password, cliente.password);
    if (!esPasswordValido) {
      return res
        .status(401)
        .json({ exito: false, mensaje: "Contraseña incorrecta" });
    }

    const claims = {
      id: cliente.id,
      nombre: cliente.nombreCompleto,
      email: cliente.correoElectronico,
      tipo: "cliente",
    };

    // Generar token JWT
    const token = generarToken(claims);

    // Opcional: establecer cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      exito: true,
      mensaje: "Inicio de sesión exitoso",
      token,
      cliente: {
        id: cliente.id,
        nombreCompleto: cliente.nombreCompleto,
        correoElectronico: cliente.correoElectronico,
        cedula: cliente.documentoIdentidad,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión de cliente:", error);
    res
      .status(500)
      .json({ exito: false, mensaje: "Error interno al iniciar sesión" });
  }
}
