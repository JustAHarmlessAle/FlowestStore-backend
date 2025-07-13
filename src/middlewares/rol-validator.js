import { body, param } from "express-validator";
import Rol from "../models/rol-model.js";

const ValidateUniqueRoleName = async (nombre) => {
  const rol = await Rol.findOne({ where: { nombre } });

  if (rol) {
    return Promise.reject("El rol ya existe");
  }
};

const validateRoleName = (value) => {
  // Verificar que no contenga números
  if (/\d/.test(value)) {
    throw new Error("El nombre del rol no debe contener números");
  }
  
  // Verificar que no contenga caracteres especiales
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
    throw new Error("El nombre del rol no debe contener caracteres especiales");
  }
  
  return true;
};

export const validarCreacionRol = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del rol es obligatorio")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre debe tener entre 3 y 30 caracteres")
    .custom(validateRoleName),
];

export const createRolValidation = [
  ...validarCreacionRol,
  body('nombre').custom(ValidateUniqueRoleName)
];

export const validacionActualizacionRol = [
  body("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre debe tener entre 3 y 30 caracteres")
    .custom(validateRoleName),
];

export const validarIdRol = [
  param("id")
    .isInt()
    .withMessage("El ID del rol debe ser un número entero"),
];
