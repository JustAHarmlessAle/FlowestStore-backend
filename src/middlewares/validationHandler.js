import { validationResult } from "express-validator"

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      exito: false,
      errores: errors.array().map((error) => ({
        campo: error.path,
        mensaje: error.msg,
      })),
    })
  }

  next()
}
