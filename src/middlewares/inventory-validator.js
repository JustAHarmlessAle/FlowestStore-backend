import { body, param, validationResult } from "express-validator";

export const validarCreacionInventario = [
  body("nombre_producto")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isString()
    .withMessage("El nombre debe ser una cadena de texto")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isInt({ min: 0 })
    .withMessage("La cantidad debe ser un número entero positivo"),

  body("precio_compra")
    .notEmpty()
    .withMessage("El precio de compra es obligatorio")
    .isFloat({ min: 0.01 })
    .withMessage("El precio de compra debe ser un número mayor a 0"),

  body("precio_venta")
    .notEmpty()
    .withMessage("El precio de venta es obligatorio")
    .isFloat({ min: 0.01 })
    .withMessage("El precio de venta debe ser un número mayor a 0")
    .custom((value, { req }) => {
      if (parseFloat(value) <= parseFloat(req.body.precio_compra)) {
        throw new Error("El precio de venta debe ser mayor al precio de compra");
      }
      return true;
    }),

  body("codigo")
    .notEmpty()
    .withMessage("El código es obligatorio")
    .isString()
    .withMessage("El código debe ser una cadena de texto")
    .isLength({ min: 3, max: 20 })
    .withMessage("El código debe tener entre 3 y 20 caracteres"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

export const validarActualizacionInventario = [
  body("nombre_producto")
    .optional()
    .isString()
    .withMessage("El nombre debe ser una cadena de texto")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

  body("cantidad")
    .optional()
    .isInt({ min: 0 })
    .withMessage("La cantidad debe ser un número entero positivo"),

  body("precio_compra")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("El precio de compra debe ser un número mayor a 0"),

  body("precio_venta")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("El precio de venta debe ser un número mayor a 0")
    .custom((value, { req }) => {
      if (req.body.precio_compra && parseFloat(value) <= parseFloat(req.body.precio_compra)) {
        throw new Error("El precio de venta debe ser mayor al precio de compra");
      }
      return true;
    }),

  body("codigo")
    .optional()
    .isString()
    .withMessage("El código debe ser una cadena de texto")
    .isLength({ min: 3, max: 20 })
    .withMessage("El código debe tener entre 3 y 20 caracteres"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

export const validarActualizacionStock = [
  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isInt({ min: 0 })
    .withMessage("La cantidad debe ser un número entero positivo"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

export const validarIdInventario = [
  param("id")
    .isInt()
    .withMessage("El ID debe ser un número entero"),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];