import { Router } from "express";
import {
  obtenerTodosLosClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  cambiarEstadoCliente,
} from "../controllers/cliente-controller.js";
import {
  validarCreacionCliente,
  validarActualizacionCliente,
  validarIdCliente,
  validarCambioEstado,
} from "../middlewares/cliente-validator.js";
import {
  autenticar,
  autorizarAdmin,
  verificarPermiso,
} from "../middlewares/autenticador-validator.js";
import { obtenerPorEstado } from "../repositories/cliente-repository.js";

const router = Router();

router.get("/clientesActivos", async (req, res) => {
  try {
    const clientesActivos = await obtenerPorEstado();
    res.json(clientesActivos);
  } catch (error) {
    console.error("Error al obtener los clientes activos:", error);
    res.status(500).json({ error: "Error al obtener los clientes activos" });
  }
});

router.get("/", obtenerTodosLosClientes);
router.get(
  "/:id", autenticar,
  validarIdCliente,
  obtenerClientePorId
);
router.post(
  "/",
  autenticar,
  verificarPermiso("clientes", "crear"),
  validarCreacionCliente,
  crearCliente
);
router.put(
  "/:id",
  autenticar,
  verificarPermiso("clientes", "editar"),
  validarIdCliente,
  validarActualizacionCliente,
  actualizarCliente
);
router.delete(
  "/:id",
  autenticar,
  autorizarAdmin, // Mantener solo admin para eliminar
  validarIdCliente,
  eliminarCliente
);
router.patch(
  "/:id/estado",
  autenticar,
  verificarPermiso("clientes", "editar"),
  validarCambioEstado,
  cambiarEstadoCliente
);

export default router;
