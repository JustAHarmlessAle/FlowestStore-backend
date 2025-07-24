import { body, param, validationResult } from "express-validator";

const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

export const validarCreacionPedido = [

  body("productos.*.id_producto")
    .notEmpty().withMessage("El ID del producto es obligatorio")
    .isInt().withMessage("El ID del producto debe ser un número entero"),

  // body("cantidad")
  //   .notEmpty().withMessage("La cantidad es obligatoria")
  //   .isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero positivo"),



  // body("direccion_envio")
  //   .notEmpty().withMessage("La dirección de envío es obligatoria")
  //   .isString().withMessage("La dirección de envío debe ser un texto"),

  body("estado")
    .optional()
    .isIn(["pendiente", "preparacion", "terminado", "cancelado"])
    .withMessage("Estado no válido. Debe ser: 'pendiente', 'preparacion', 'terminado' o 'cancelado'"),

  body().custom(body => {
    if (!body.id_cliente && !body.documentoIdentidad) {
      throw new Error("Debe proporcionar el id_cliente o el documentoIdentidad");
    }
    return true;
  }),

  validarErrores,
];

export const validarActualizacionPedido = [
  body("productos.*.id_producto")
    .optional()
    .isInt().withMessage("El ID del producto debe ser un número entero"),

  // body("cantidad")
  //   .optional()
  //   .isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero positivo"),

  body("metodo_pago")
    .optional()
    .isIn(["Efectivo", "Transferencia"]).withMessage("Método de pago no válido"),

  // body("direccion_envio")
  //   .optional()
  //   .isString().withMessage("La dirección de envío debe ser un texto"),

  body("estado")
    .optional()
    .isIn(["pendiente", "preparacion", "terminado", "cancelado"])
    .withMessage("Estado no válido. Debe ser: 'pendiente', 'preparacion', 'terminado' o 'cancelado'"),

  validarErrores,
];

export const validarIdPedido = [
  param("id")
    .isInt().withMessage("El ID del pedido debe ser un número entero"),

  validarErrores,
];

export const validarCambioEstadoPedido = [
  param("id")
    .isInt().withMessage("El ID del pedido debe ser un número entero"),

  body("estado")
    .notEmpty().withMessage("El estado del pedido es obligatorio")
    .isIn(["pendiente", "preparacion", "terminado", "cancelado"])
    .withMessage("Estado no válido. Debe ser: 'pendiente', 'preparacion', 'entregado' o 'cancelado'"),

  validarErrores,
];
