// --- START OF FILE productos-validator.js (MEJORADO) ---

import { body, param, validationResult } from "express-validator";

export const validarCreacionProducto = [
  // ... (validaciones de nombre, precio, estado, descripcion sin cambios)
  body("nombre")
    .notEmpty().withMessage("El nombre del producto es obligatorio")
    .isString().withMessage("El nombre debe ser una cadena de texto")
    .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("precio")
    .notEmpty().withMessage("El precio es obligatorio")
    .isFloat({ min: 0.01 }).withMessage("El precio debe ser un número mayor a 0"),
    
  body("estado")
    .notEmpty().withMessage("El estado del producto es obligatorio")
    .isIn(["activo", "inactivo"]).withMessage("El estado debe ser 'activo' o 'inactivo' "),

  body("descripcion")
    .notEmpty().withMessage("La descripción es obligatoria")
    .isString().withMessage("La descripción debe ser una cadena de texto"),

  // 👇 AÑADIR ESTA VALIDACIÓN
  body("Id_Categoria")
    .notEmpty().withMessage("La categoría es obligatoria")
    .isInt({ min: 1 }).withMessage("El ID de la categoría debe ser un número entero positivo"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

export const validarActualizacionProducto = [
  // ... (validaciones de nombre, precio, estado, descripcion sin cambios)
  body("nombre").optional().isString().isLength({ min: 3, max: 50 }),
  body("precio").optional().isFloat({ min: 0.01 }),
  body("estado").optional().isIn(["activo", "inactivo"]),
  body("descripcion").optional().isString(),

  // 👇 AÑADIR ESTA VALIDACIÓN (opcional, para que no sea obligatorio actualizarla)
  body("Id_Categoria")
    .optional()
    .isInt({ min: 1 }).withMessage("El ID de la categoría debe ser un número entero positivo"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

// ... (validarIdProducto sin cambios)
export const validarIdProducto = [
  param("id").isInt().withMessage("El ID debe ser un número entero"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];