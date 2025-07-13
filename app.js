import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { conectarDB } from "./src/config/database.js";
import routercategoria from "./src/routes/categoria-routes.js";
import routerautenticacion from "./src/routes/autenticacion-routes.js";
import { sincronizarModelos } from "./src/models/index.js";
import router from "./src/routes/cliente-routes.js";
import routerproducto from "./src/routes/productos-routes.js";
import routerpedido from "./src/routes/pedido-routes.js";
import routerVenta from "./src/routes/venta-routes.js";
import routerol from "./src/routes/rol-routes.js";
import routerPermiso from "./src/routes/permiso-routes.js";
import routerDashboard from "./src/routes/dashboard-routes.js";
import recuperacionRoutes from "./src/routes/recuperacion-routes.js";
import routerInventory from "./src/routes/inventory-routes.js";
import { initSettings } from "./seeder/initSettings.js";

dotenv.config();

const app = express();

// Configuración de CORS mejorada para cookies
app.use(
  cors({
    origin: "*",
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL del frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // Middleware para parsear cookies
app.use(express.urlencoded({ extended: true }));

app.get("/api/test", (req, res) => {
  res.json({ mensaje: "API de Restaurante funcionando correctamente" });
});

app.use("/api/clientes", router);
app.use("/api/productos", routerproducto);
app.use("/api/pedidos", routerpedido);
app.use("/api/ventas", routerVenta);
app.use("/api/autenticacion", routerautenticacion);
app.use("/api/categoria", routercategoria);
app.use("/api/rol", routerol);
app.use("/api/permiso", routerPermiso);
app.use("/api/dashboard", routerDashboard);
app.use("/api/recuperacion", recuperacionRoutes);
app.use("/api/inventory", routerInventory);

// Middleware de manejo de errores
app.use(errorHandler);

const inicializarBaseDeDatos = async () => {
  try {
    await conectarDB();
    await sincronizarModelos();
    console.log("Base de datos inicializada correctamente");
    await initSettings();
    console.log("Configuración inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

inicializarBaseDeDatos();

export default app;
