import { body, param } from "express-validator";
import Categoria from "../models/categoria-model.js";

const ValidateUniqueCategoryName = async (nombre)=> {
  const category = await Categoria.findOne({where:{nombre}})

  if (category) {
    return Promise.reject("La categoria ya Existe")
  }
}
export const validarCreacionCategoriaExistente = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de categoria es obligatorio")
    .isString().withMessage("El nombre debe ser un texto")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 a 50 caracteres"),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 100 })
    .withMessage("La descripción debe tener entre 5 a 100 caracteres"),
];

export const createValidation =[
  ...validarCreacionCategoriaExistente,
  body('nombre').custom(ValidateUniqueCategoryName)
]

export const validacionActualizacionCategorias = [
  body("nombreCategoria")
    .optional()
    .isString().withMessage("El nombre debe ser un texto")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 a 50 caracteres"),

  body("descripcionCategoria")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La descripción debe tener entre 5 a 100 caracteres"),
];

export const validarIdCategoria = [
  param("id")
    .isInt()
    .withMessage("El ID de la categoría debe ser un número entero"),
];

