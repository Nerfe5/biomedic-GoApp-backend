const sqlite3 = require('better-sqlite3');
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, '../db/database.sqlite');

// Conexión a la base de datos
const db = sqlite3(dbPath);

// Crear tabla de reportes si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS reportes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        equipo TEXT NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        serie TEXT NOT NULL,
        ubicacion TEXT NOT NULL,
        proveedor TEXT NOT NULL,
        falla TEXT NOT NULL,
        nombre TEXT NOT NULL,
        puesto TEXT NOT NULL,
        matricula TEXT NOT NULL,
        fecha TEXT NOT NULL,
        fechaEnvio TEXT NOT NULL
    )
`);

// Función para insertar un nuevo reporte
function insertarReporte(reporte) {
    const stmt = db.prepare(`
        INSERT INTO reportes (equipo, marca, modelo, serie, ubicacion, proveedor, falla, nombre, puesto, matricula, fecha, fechaEnvio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(reporte.equipo, reporte.marca, reporte.modelo, reporte.serie, reporte.ubicacion, reporte.proveedor, reporte.falla, reporte.nombre, reporte.puesto, reporte.matricula, reporte.fecha, reporte.fechaEnvio);
}

// Exportar funciones
module.exports = {
    insertarReporte,
};