import { InventoryService } from "../services/inventory-service.js";

export class InventoryController {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  async obtenerProductos(req, res) {
    try {
      const productos = await this.inventoryService.listarProductosInventario();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await this.inventoryService.buscarProductoInventarioPorId(id);
      res.json(producto);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async crearProducto(req, res) {
    try {
      const datosProducto = req.body;
      const nuevoProducto = await this.inventoryService.registrarProductoInventario(datosProducto);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      const productoActualizado = await this.inventoryService.modificarProductoInventario(id, datosActualizados);
      res.json(productoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const resultado = await this.inventoryService.eliminarProductoInventario(id);
      res.json(resultado);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const productoActualizado = await this.inventoryService.actualizarStockProducto(id, cantidad);
      res.json(productoActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorCodigo(req, res) {
    try {
      const { codigo } = req.params;
      const producto = await this.inventoryService.buscarProductoPorCodigo(codigo);
      res.json(producto);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}