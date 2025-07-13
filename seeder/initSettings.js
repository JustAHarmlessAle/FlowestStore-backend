import Permiso from "../src/models/permiso-model.js";
import Rol from "../src/models/rol-model.js";
import PermisoRol from "../src/models/permiso-rol-model.js";
import { crearUsuarioController } from "../src/controllers/autenticador-controller.js";
import Usuario from "../src/models/usuario-model.js";

export const initSettings = async () => {
  // Create admin role
  const rolAdmin = await Rol.findOrCreate({
    where: { nombre: "administrador" },
    defaults: {
      descripcion: "Rol con todos los permisos del sistema",
    },
  }).then(([rol]) => rol);

  // Definir todos los permisos del sistema por módulo
  const permisosModulos = [
    // Permisos de Ventas
    {
      recurso: "ventas",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevas ventas",
        "Permite editar ventas existentes",
        "Permite eliminar ventas",
        "Permite ver ventas",
      ],
    },
    // Permisos de Inventario
    {
      recurso: "inventario",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos productos en inventario",
        "Permite editar productos en inventario",
        "Permite eliminar productos del inventario",
        "Permite ver el inventario",
      ],
    },
    // Permisos de Productos
    {
      recurso: "productos",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos productos",
        "Permite editar productos",
        "Permite eliminar productos",
        "Permite ver productos",
      ],
    },
    // Permisos de Pedidos
    {
      recurso: "pedidos",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos pedidos",
        "Permite editar pedidos",
        "Permite eliminar pedidos",
        "Permite ver pedidos",
      ],
    },
    // Permisos de Clientes
    {
      recurso: "clientes",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos clientes",
        "Permite editar clientes",
        "Permite eliminar clientes",
        "Permite ver clientes",
      ],
    },
    // Permisos de Categorías
    {
      recurso: "categorias",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevas categorías",
        "Permite editar categorías",
        "Permite eliminar categorías",
        "Permite ver categorías",
      ],
    },
    // Permisos de Usuarios
    {
      recurso: "usuarios",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos usuarios",
        "Permite editar usuarios",
        "Permite eliminar usuarios",
        "Permite ver usuarios",
      ],
    },
    // Permisos de Roles
    {
      recurso: "roles",
      acciones: ["crear", "editar", "eliminar", "ver"],
      descripciones: [
        "Permite crear nuevos roles",
        "Permite editar roles",
        "Permite eliminar roles",
        "Permite ver roles",
      ],
    },
  ];

  // Crear todos los permisos
  const permisosCreados = [];
  for (const modulo of permisosModulos) {
    const permisosModulo = await Promise.all(
      modulo.acciones.map((accion, index) =>
        Permiso.findOrCreate({
          where: {
            recurso: modulo.recurso,
            accion: accion,
          },
          defaults: {
            descripcion: modulo.descripciones[index],
          },
        }).then(([permiso]) => permiso)
      )
    );
    permisosCreados.push(...permisosModulo);
  }

  // Asignar todos los permisos al rol de administrador
  await Promise.all(
    permisosCreados.map((permiso) =>
      PermisoRol.findOrCreate({
        where: {
          rol_id: rolAdmin.id,
          permiso_id: permiso.id,
        },
      })
    )
  );

  // Create proveedor role with specific permissions
  const rolProveedor = await Rol.findOrCreate({
    where: { nombre: "proveedor" },
    defaults: {
      descripcion: "Rol para gestión de inventario y productos",
    },
  }).then(([rol]) => rol);

  // Asignar permisos específicos al rol de proveedor
  const permisosProveedor = permisosCreados.filter((permiso) =>
    ["inventario", "productos"].includes(permiso.recurso)
  );

  await Promise.all(
    permisosProveedor.map((permiso) =>
      PermisoRol.findOrCreate({
        where: {
          rol_id: rolProveedor.id,
          permiso_id: permiso.id,
        },
      })
    )
  );

  // Simular req y res
  const mockReq = {
    body: {
      password: "admin",
      id_rol: rolAdmin.id,
      nombre: "Administrador",
      email: "a@b.com",
    },
  };

  const mockRes = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log("Usuario creado:", data);
    },
  };

  // Check if user exists before creating
  const existingUser = await Usuario.findOne({
    where: { email: mockReq.body.email },
  });

  if (!existingUser) {
    await crearUsuarioController(mockReq, mockRes);
    // console.log("Usuario administrador creado exitosamente");
  } else {
    console.log("El usuario administrador ya existe");
  }

  // Create test provider user
  const mockReqProveedor = {
    body: {
      password: "proveedor123",
      id_rol: rolProveedor.id,
      nombre: "Proveedor Test",
      email: "proveedor@test.com",
    },
  };

  const mockResProveedor = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log("Usuario proveedor creado:", data);
    },
  };

  // Check if provider user exists before creating
  const existingProvider = await Usuario.findOne({
    where: { email: mockReqProveedor.body.email },
  });

  if (!existingProvider) {
    await crearUsuarioController(mockReqProveedor, mockResProveedor);
    console.log("Usuario proveedor creado exitosamente");
  } else {
    console.log("El usuario proveedor ya existe");
  }
};
