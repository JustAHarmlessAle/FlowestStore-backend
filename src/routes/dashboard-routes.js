import { Router } from "express";
import {
  obtenerResumen,
  obtenerEstadisticasSemanal,
  obtenerMetodosPagoHoy,
  obtenerVentasEnTiempoReal,
  obtenerVentasSemanales // Importa la función para ventas semanales
} from "../controllers/dashboard-controller.js";

const routerDashboard = Router();

// Rutas públicas del dashboard
routerDashboard.get("/resumen", obtenerResumen);
routerDashboard.get("/estadisticas/semanal", obtenerEstadisticasSemanal);
routerDashboard.get("/metodos-pago/hoy", obtenerMetodosPagoHoy);
routerDashboard.get("/ventas/tiempo-real", obtenerVentasEnTiempoReal);
routerDashboard.get("/ventas/semanales", obtenerVentasSemanales); // Agrega esta línea

export default routerDashboard;