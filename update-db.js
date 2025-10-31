/**
 * Script para actualizar la estructura de la tabla equipos
 * Agrega las columnas 'foto' y 'descripcion'
 */

const db = require('./db');

try {
    console.log('Actualizando estructura de la tabla equipos...');
    
    // Agregar columna foto
    try {
        db.exec('ALTER TABLE equipos ADD COLUMN foto TEXT');
        console.log('✅ Columna "foto" agregada');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('ℹ️  Columna "foto" ya existe');
        } else {
            throw err;
        }
    }
    
    // Agregar columna descripcion
    try {
        db.exec('ALTER TABLE equipos ADD COLUMN descripcion TEXT');
        console.log('✅ Columna "descripcion" agregada');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('ℹ️  Columna "descripcion" ya existe');
        } else {
            throw err;
        }
    }
    
    console.log('\n✅ Actualización completada exitosamente');
    console.log('Puedes reiniciar el servidor backend ahora.');
    
} catch (err) {
    console.error('❌ Error al actualizar la base de datos:', err);
    process.exit(1);
}
