const fs = require('fs');
const path = require('path');

// Ruta de la base de datos y carpeta de backups
const dbPath = path.join(__dirname, 'biomedic.db');
const backupDir = path.join(__dirname, 'backups');

// Asegura que exista la carpeta de backups
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Nombre del archivo de respaldo con fecha y hora
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `biomedic-backup-${timestamp}.db`);

// Copia el archivo
fs.copyFileSync(dbPath, backupFile);

console.log(`Respaldo creado: ${backupFile}`);