const db = require('./db');

console.log('Agregando columnas foto y descripcion a tabla equipos...');

try {
    // Agregar columna foto
    db.prepare('ALTER TABLE equipos ADD COLUMN foto TEXT').run();
    console.log('✓ Columna foto agregada');
} catch (e) {
    if (e.message.includes('duplicate column')) {
        console.log('✓ Columna foto ya existe');
    } else {
        throw e;
    }
}

try {
    // Agregar columna descripcion
    db.prepare('ALTER TABLE equipos ADD COLUMN descripcion TEXT').run();
    console.log('✓ Columna descripcion agregada');
} catch (e) {
    if (e.message.includes('duplicate column')) {
        console.log('✓ Columna descripcion ya existe');
    } else {
        throw e;
    }
}

console.log('\nMigración completada. Verificando estructura...');
const info = db.prepare('PRAGMA table_info(equipos)').all();
console.table(info);
