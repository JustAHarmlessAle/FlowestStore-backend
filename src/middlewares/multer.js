// --- START OF FILE multer.js (VERSIÓN FINAL CORREGIDA) ---

import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // 👈 1. Importar el módulo File System

// Obtener la ruta del directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir el directorio de subidas para que esté en la raíz del proyecto
const uploadDir = path.join(__dirname, "../../uploads"); // 👈 2. Subir DOS niveles (desde src/middlewares)

// 👈 3. VERIFICAR Y CREAR LA CARPETA SI NO EXISTE
// Esto hace que tu aplicación sea más robusta.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar el almacenamiento (storage)
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    // Crear un nombre de archivo único para evitar sobreescrituras
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Añadir un filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: El archivo debe ser una imagen válida (jpeg, jpg, png, gif, webp)"));
};

// Crear y exportar la instancia de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB por archivo
  fileFilter: fileFilter,
});

export default upload;