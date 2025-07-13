import { validationResult } from "express-validator";

export const validarResultado = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      errores: errores.array(),
    });
  }
  next();
};