import { body, param } from "express-validator";
import  {validarResultado}  from "./validador.js";

// Validador para ID de venta
export const validarIdVenta = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de la venta debe ser un número entero positivo"),
  validarResultado,
];

// Validación para la creación de una venta
export const validarCreacionVenta = [
  body("id_pedido")
    .isInt({ min: 1 })
    .withMessage("El ID del pedido debe ser un número entero positivo")
    .notEmpty()
    .withMessage("El ID del pedido es obligatorio"),
  
  body("metodo_pago")
    .isIn(["efectivo", "transferencia"])
    .withMessage("El método de pago debe ser 'efectivo' o 'transferencia'")
    .notEmpty()
    .withMessage("El método de pago es obligatorio"),
  
    validarResultado,
];

// Validación para la actualización de una venta
export const validarActualizacionVenta = [
  body("metodo_pago")
    .optional()
    .isIn(["efectivo", "transferencia"])
    .withMessage("El método de pago debe ser 'efectivo' o 'transferencia'"),
  
    validarResultado,
];

export const validarMetodoPago = [
  body("metodo_pago")
    .exists().withMessage("El método de pago es obligatorio.")
    .isIn(["efectivo", "transferencia"]).withMessage("Método de pago no válido."),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errores.array(),
      });
    }
    next();
  }
];