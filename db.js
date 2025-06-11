const Database = require('better-sqlite3');
const path = require('path');

// La base de datos estará en la raíz del backend
const db = new Database(path.join(__dirname, 'biomedic.db'));

// Crea la tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS reportes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT,
    equipo TEXT,
    marca TEXT,
    modelo TEXT,
    serie TEXT,
    ubicacion TEXT,
    proveedor TEXT,
    correo TEXT,
    falla TEXT,
    nombre TEXT,
    puesto TEXT,
    matricula TEXT,
    fechaEnvio TEXT
  )
`).run();

module.exports = db;