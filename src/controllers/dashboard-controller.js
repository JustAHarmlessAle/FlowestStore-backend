import { DashboardService } from "../services/dashboard-services.js";

const dashboardService = new DashboardService();

export const obtenerResumen = async (req, res) => {
  try {
    const resumen = await dashboardService.obtenerResumen();
    res.json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error("Error en obtenerResumen:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener resumen del dashboard",
      error: error.message
    });
  }
};

export const obtenerEstadisticasSemanal = async (req, res) => {
  try {
    const estadisticas = await dashboardService.obtenerEstadisticasSemanal();
    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error("Error en obtenerEstadisticasSemanal:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas semanales",
      error: error.message
    });
  }
};

export const obtenerMetodosPagoHoy = async (req, res) => {
  try {
    const metodosPago = await dashboardService.obtenerMetodosPagoHoy();
    res.json({
      success: true,
      data: metodosPago
    });
  } catch (error) {
    console.error("Error en obtenerMetodosPagoHoy:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener métodos de pago",
      error: error.message
    });
  }
};

export const obtenerVentasEnTiempoReal = async (req, res) => {
  try {
    const ventas = await dashboardService.obtenerVentasEnTiempoReal(); //MODIFICACION: antes se llamaba a obtenerVentasEnTiempoReal, ahora a obtenerVentasHoy
    res.json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error("Error en obtenerVentasEnTiempoReal:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener ventas en tiempo real",
      error: error.message
    });
  }
};

export const obtenerVentasSemanales = async (req, res) => {
    try {
        const ventasSemanales = await dashboardService.obtenerVentasSemanales();
        res.json({ success: true, data: ventasSemanales });
    } catch (error) {
        console.error("Error al obtener ventas semanales:", error);
        res.status(500).json({ success: false, message: "Error al obtener ventas semanales", error: error.message });
    }
};