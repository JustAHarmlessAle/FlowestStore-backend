import { Op } from "sequelize";
import Venta from "../models/venta-model.js";
import Pedido from "../models/pedido-model.js";
import Cliente from "../models/cliente-model.js";


export class DashboardService {
  
  async obtenerResumen() {
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finHoy = new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000);

      // Inicio de la semana (lunes)
      const inicioSemana = new Date(hoy);
      const dia = inicioSemana.getDay();
      const diff = inicioSemana.getDate() - dia + (dia === 0 ? -6 : 1);
      inicioSemana.setDate(diff);
      inicioSemana.setHours(0, 0, 0, 0);

      // Inicio del mes
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      // Ventas de hoy
      const ventasHoy = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.gte]: inicioHoy,
            [Op.lt]: finHoy
          }
        }
      });

      // Ventas de la semana
      const ventasSemana = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.gte]: inicioSemana
          }
        }
      });

      // Ventas del mes
      const ventasMes = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.gte]: inicioMes
          }
        }
      });

      const montoVentasHoy = ventasHoy.reduce((sum, venta) => sum + parseFloat(venta.total_pagar || 0), 0);
      const montoVentasSemana = ventasSemana.reduce((sum, venta) => sum + parseFloat(venta.total_pagar || 0), 0);
      const montoVentasMes = ventasMes.reduce((sum, venta) => sum + parseFloat(venta.total_pagar || 0), 0);

      return {
        montoVentasHoy,
        cantidadVentasHoy: ventasHoy.length,
        montoVentasSemana,
        cantidadVentasSemana: ventasSemana.length,
        montoVentasMes,
        cantidadVentasMes: ventasMes.length,
        fechaActualizacion: new Date()
      };
    } catch (error) {
      console.error("Error en obtenerResumen:", error);
      throw error;
    }
  }

  async obtenerEstadisticasSemanal() {
    try {
      const hoy = new Date();
      const inicioSemana = new Date(hoy);
      const dia = inicioSemana.getDay();
      const diff = inicioSemana.getDate() - dia + (dia === 0 ? -6 : 1);
      inicioSemana.setDate(diff);
      inicioSemana.setHours(0, 0, 0, 0);

      const estadisticas = [];
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

      for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicioSemana);
        fecha.setDate(inicioSemana.getDate() + i);
        
        const inicioDia = new Date(fecha);
        inicioDia.setHours(0, 0, 0, 0);
        
        const finDia = new Date(fecha);
        finDia.setHours(23, 59, 59, 999);

        const ventasDia = await Venta.findAll({
          where: {
            fecha_venta: {
              [Op.gte]: inicioDia,
              [Op.lte]: finDia
            }
          }
        });

        const monto = ventasDia.reduce((sum, venta) => sum + parseFloat(venta.total_pagar || 0), 0);

        estadisticas.push({
          fecha: fecha.toISOString().split('T')[0],
          dia: diasSemana[i],
          monto,
          cantidad: ventasDia.length,
          esHoy: fecha.toDateString() === hoy.toDateString()
        });
      }

      return estadisticas;
    } catch (error) {
      console.error("Error en obtenerEstadisticasSemanal:", error);
      throw error;
    }
  }

  async obtenerMetodosPagoHoy() {
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finHoy = new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000);

      const ventasHoy = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.gte]: inicioHoy,
            [Op.lt]: finHoy
          }
        },
        attributes: ['metodo_pago', 'total_pagar']
      });

      const metodosPago = {
        efectivo: { cantidad: 0, monto: 0 },
        transferencia: { cantidad: 0, monto: 0 }
      };

      ventasHoy.forEach(venta => {
        const metodo = venta.metodo_pago;
        metodosPago[metodo].cantidad += 1;
        metodosPago[metodo].monto += parseFloat(venta.total_pagar || 0);
      });

      const total = metodosPago.efectivo.monto + metodosPago.transferencia.monto;

      return {
        efectivo: {
          ...metodosPago.efectivo,
          porcentaje: total > 0 ? (metodosPago.efectivo.monto / total * 100).toFixed(1) : 0
        },
        transferencia: {
          ...metodosPago.transferencia,
          porcentaje: total > 0 ? (metodosPago.transferencia.monto / total * 100).toFixed(1) : 0
        },
        total: {
          cantidad: metodosPago.efectivo.cantidad + metodosPago.transferencia.cantidad,
          monto: total
        }
      };
    } catch (error) {
      console.error("Error en obtenerMetodosPagoHoy:", error);
      throw error;
    }
  }

  async obtenerVentasEnTiempoReal() {
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finHoy = new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000);

      const ventas = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.gte]: inicioHoy,
            [Op.lt]: finHoy
          }
        },
        include: [
          {
            model: Pedido,
            include: [
              {
                model: Cliente,
                attributes: ['nombrecompleto']
              }
            ]
          }
        ],
        order: [['fecha_venta', 'DESC']],
        limit: 10
      });

      return ventas;
    } catch (error) {
      console.error("Error en obtenerVentasHoy:", error);
      throw error;
    }
  }

  async obtenerVentasSemanales() {
  try {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    const dia = inicioSemana.getDay();
    const diff = inicioSemana.getDate() - dia + (dia === 0 ? -6 : 1);
    inicioSemana.setDate(diff);
    inicioSemana.setHours(0, 0, 0, 0);

    const ventas = await Venta.findAll({
      where: {
        fecha_venta: {
          [Op.gte]: inicioSemana
        }
      },
      include: [
        {
          model: Pedido,
          include: [
            {
              model: Cliente,
              attributes: ['nombrecompleto']
            }
          ]
        }
      ],
      order: [['fecha_venta', 'DESC']]
    });

    return ventas;
  } catch (error) {
    console.error("Error en obtenerVentasSemanales:", error);
    throw error;
  }
}

}