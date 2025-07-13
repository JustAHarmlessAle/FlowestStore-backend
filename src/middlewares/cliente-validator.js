import { body, validationResult } from "express-validator";
import { ClienteRepository } from "../repositories/cliente-repository.js";

const clienteRepository = new ClienteRepository();

export async function validarCreacionCliente(req, res, next) {
  try {
    await Promise.all([
      body("nombreCompleto")
        
        .notEmpty().withMessage("El nombre completo es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ min: 3, max: 100 }).withMessage("Debe tener entre 3 y 100 caracteres")
        .run(req),
        
      body("tipoDocumento")
        .optional()
        .isIn(["cc", "tarjeta identidad", "passport"])
        .withMessage("Tipo ingrese cc, tarjeta identidad o passport")
        .run(req),

      body("documentoIdentidad")
        .notEmpty().withMessage("El documento es obligatorio")
        .isLength({ min: 6, max: 10 }).withMessage("Debe tener entre 6 y 10 caracteres")
        .run(req),

      body("correoElectronico")
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("Debe ser un correo válido")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/i)
        .withMessage("Debe terminar en '.com', '.net' o '.org'")
        .run(req),

      body("telefono")
        .notEmpty().withMessage("El teléfono es obligatorio")
        .isNumeric().withMessage("Debe contener solo números")
        .isLength({ min: 10, max: 10 }).withMessage("Debe tener exactamente 10 caracteres")
        .run(req),

      body("direccion")
        .notEmpty().withMessage("La dirección es obligatoria")
        .isLength({ min: 5, max: 200 }).withMessage("Debe tener entre 5 y 200 caracteres")
        .run(req),

      body("genero")
        .notEmpty().withMessage("El género es obligatorio")
        .isIn(["masculino", "femenino", "0tro"])
        .withMessage("Debe ser: masculino, femenino , otro")
        .run(req)
    ]);

    
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errores.array() });
    }

    
    const { documentoIdentidad, correoElectronico, telefono } = req.body;

    const existeDocumento = await clienteRepository.obtenerPorDocumento(documentoIdentidad);
    if (existeDocumento) {
      return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este documento" });
    }

    const existeCorreo = await clienteRepository.obtenerPorEmail(correoElectronico);
    if (existeCorreo) {
      return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este correo" });
    }

    const existeTelefono = await clienteRepository.obtenerPorTelefono(telefono);
    if (existeTelefono) {
      return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este teléfono" });
    }

    next();
  } catch (error) {
    console.error("Error en la validación del cliente:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
  }
}


export async function validarActualizacionCliente(req, res, next) {
  try {
    const { id } = req.params;
    const { documentoIdentidad, correoElectronico, telefono } = req.body;

    // Validación de ID
    const clienteActual = await clienteRepository.obtenerPorId(id);
    if (!clienteActual) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    // Validaciones de campos con express-validator
    await Promise.all([
      body("documentoIdentidad")
        .optional()
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ min: 6, max: 10 }).withMessage("Debe tener entre 6 y 10 caracteres")
        .run(req),

      body("correoElectronico")
        .optional()
        .isEmail().withMessage("Debe ser un correo válido")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/i)
        .withMessage("Debe terminar en '.com', '.net' o '.org'")
        .run(req),

      body("telefono")
        .optional()
        .isNumeric().withMessage("Debe contener solo números")
        .isLength({ min: 10, max: 10 }).withMessage("Debe tener exactamente 10 caracteres")
        .run(req),
    ]);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ exito: false, errores: errores.array() });
    }

    // Verificación de existencia en la base de datos
    if (documentoIdentidad && documentoIdentidad !== clienteActual.documentoIdentidad) {
      const existeDocumento = await clienteRepository.obtenerPorDocumento(documentoIdentidad);
      if (existeDocumento) {
        return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este documento" });
      }
    }

    if (correoElectronico && correoElectronico !== clienteActual.correoElectronico) {
      const existeCorreo = await clienteRepository.obtenerPorEmail(correoElectronico);
      if (existeCorreo) {
        return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este correo" });
      }
    }

    if (telefono && telefono !== clienteActual.telefono) {
      const existeTelefono = await clienteRepository.obtenerPorTelefono(telefono);
      if (existeTelefono) {
        return res.status(400).json({ exito: false, mensaje: "Ya existe un cliente con este teléfono" });
      }
    }

    return next();
  } catch (error) {
    console.error("Error en la validación del cliente:", error);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
  }
}


export async function validarIdCliente(req, res, next) {
  try {
    const { id } = req.params;
    const cliente = await clienteRepository.obtenerPorId(id);

    if (!cliente) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    next();
  } catch (error) {
    console.error("Error en la validación del ID del cliente:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
  }
}

export async function validarCambioEstado(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cliente = await clienteRepository.obtenerPorId(id);
    if (!cliente) {
      return res.status(404).json({ exito: false, mensaje: "Cliente no encontrado" });
    }

    if (estado !== "activo" && estado !== "inactivo") {
      return res.status(400).json({ exito: false, mensaje: "El estado debe ser 'activo' o 'inactivo'" });
    }

    next();
  } catch (error) {
    console.error("Error en la validación del cambio de estado del cliente:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
  }
}
