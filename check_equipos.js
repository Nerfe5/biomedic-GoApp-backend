const db = require('./db');

try {
    const rows = db.prepare('SELECT * FROM equipos ORDER BY id DESC').all();
    console.log('=== EQUIPOS EN BASE DE DATOS ===');
    console.log(JSON.stringify(rows, null, 2));
    console.log(`\nTotal equipos: ${rows.length}`);
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
