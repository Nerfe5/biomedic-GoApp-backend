require('dotenv').config(); 
const Joi = require('joi');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const logger = require('./logger');

const app = express();
const PORT = 3001;


// Esquema de validación con Joi
const reporteSchema = Joi.object({
    fecha: Joi.string().required(),
    equipo: Joi.string().required(),
    marca: Joi.string().required(),
    modelo: Joi.string().required(),
    serie: Joi.string().required(),
    ubicacion: Joi.string().required(),
    proveedor: Joi.string().required(),
    correo: Joi.string().email().required(),
    falla: Joi.string().required(),
    nombre: Joi.string().required(),
    puesto: Joi.string().required(),
    matricula: Joi.string().pattern(/^\d+$/).required() // Solo números
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use((err, req, res, next) => {
    logger.error('Error global:', err);
    res.status(500).json({
        ok: false,
        message: 'Error inesperado en el servidor.'
    });
});

// Ruta para recibir el formulario
app.post('/api/reporte', async (req, res) => {
    logger.info('--- INICIO /api/reporte ---');
    const { error } = reporteSchema.validate(req.body);
    if (error) {
        logger.warn(`Validación fallida: ${error.details[0].message}`);
        return res.status(400).json({
            ok: false,
            message: 'Datos inválidos',
            error: error.details[0].message
        });
    }
    try {
        logger.info(`Cuerpo recibido: ${JSON.stringify(req.body)}`);
        const stmt = db.prepare(`
            INSERT INTO reportes (
                fecha, equipo, marca, modelo, serie, ubicacion, proveedor, correo, falla, nombre, puesto, matricula, fechaEnvio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            req.body.fecha,
            req.body.equipo,
            req.body.marca,
            req.body.modelo,
            req.body.serie,
            req.body.ubicacion,
            req.body.proveedor,
            req.body.correo,
            req.body.falla,
            req.body.nombre,
            req.body.puesto,
            req.body.matricula,
            new Date().toISOString()
        );
        logger.info('Reporte guardado en SQLite.');

        // Guardar evidencia en archivo
        const reportPath = path.join(__dirname, 'reportes.json');
        let reportes = [];
        if (fs.existsSync(reportPath)) {
            logger.info('Leyendo archivo reportes.json...');
            reportes = JSON.parse(fs.readFileSync(reportPath));
        }
        reportes.push({ ...req.body, fechaEnvio: new Date().toISOString() });
        fs.writeFileSync(reportPath, JSON.stringify(reportes, null, 2));
        logger.info('Reporte guardado en archivo.');

        // Configuración de correo
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });
        logger.info('Transporter SMTP creado.');

        // Enviar correo
        await transporter.sendMail({
            from: `"Biomedic-Go" <${process.env.SMTP_USER}>`,
            to: req.body.correo,
            subject: 'Nuevo reporte de avería de equipo médico',
            html: `
                <div style="font-family: Arial, sans-serif; color: #222;">
                    <h2 style="color: #007bff; margin-bottom: 10px;">Nuevo reporte de avería de equipo médico</h2>
                    <table style="border-collapse: collapse; width: 100%; margin-bottom: 18px;">
                        <thead>
                            <tr>
                                <th colspan="2" style="background: #f0f4fa; color: #007bff; text-align: left; padding: 8px; font-size: 1.1em;">Datos del equipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 6px 8px;"><b>Equipo:</b></td><td style="padding: 6px 8px;">${req.body.equipo}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Marca:</b></td><td style="padding: 6px 8px;">${req.body.marca}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Modelo:</b></td><td style="padding: 6px 8px;">${req.body.modelo}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Serie:</b></td><td style="padding: 6px 8px;">${req.body.serie}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Ubicación:</b></td><td style="padding: 6px 8px;">${req.body.ubicacion}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Proveedor:</b></td><td style="padding: 6px 8px;">${req.body.proveedor}</td></tr>
                            <tr><td style="padding: 6px 8px; vertical-align: top;"><b>Falla:</b></td><td style="padding: 6px 8px;">${req.body.falla}</td></tr>
                        </tbody>
                    </table>
                    <table style="border-collapse: collapse; width: 100%;">
                        <thead>
                            <tr>
                                <th colspan="2" style="background: #f0f4fa; color: #007bff; text-align: left; padding: 8px; font-size: 1.1em;">Datos del solicitante</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 6px 8px;"><b>Nombre:</b></td><td style="padding: 6px 8px;">${req.body.nombre}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Puesto:</b></td><td style="padding: 6px 8px;">${req.body.puesto}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Matrícula:</b></td><td style="padding: 6px 8px;">${req.body.matricula}</td></tr>
                            <tr><td style="padding: 6px 8px;"><b>Fecha:</b></td><td style="padding: 6px 8px;">${req.body.fecha}</td></tr>
                        </tbody>
                    </table>
                    <div style="margin-top: 18px; color: #888; font-size: 0.95em;">
                        <em>Este correo fue generado automáticamente por el sistema Biomedic-GoApp.</em>
                    </div>
                </div>
            `
        });
        logger.info('Correo enviado correctamente.');

        res.json({ ok: true, message: 'Reporte enviado y almacenado correctamente.' });
        logger.info('Respuesta enviada al frontend.');
    } catch (err) {
        logger.error('Error en /api/reporte:', err);
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error interno. Intenta más tarde.'
        });
    }
    logger.info('--- FIN /api/reporte ---');
});

// Pantalla de inicio / mensaje de bienvenida
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 24px; border-radius: 12px; background: #f4f8fb; box-shadow: 0 2px 8px #0001;">
            <h1 style="color: #007bff;">Biomedic-GoApp Backend</h1>
            <p>✅ El servidor está en línea y funcionando.</p>
            <ul>
                <li><b>POST</b> <code>/api/reporte</code> — Enviar reporte de avería</li>
                <li><b>GET</b> <code>/api/reportes</code> — Consultar reportes almacenados</li>
            </ul>
            <p style="color: #888; font-size: 0.95em;">
                Documentación y detalles en el archivo <code>README.md</code> del repositorio.<br>
                &copy; ${new Date().getFullYear()} Biomedic-GoApp
            </p>
        </div>
    `);
});

// Endpoint para consultar todos los reportes
app.get('/api/reportes', (req, res) => {
    try {
        const reportes = db.prepare('SELECT * FROM reportes ORDER BY fechaEnvio DESC').all();
        res.json({ ok: true, reportes });
        logger.info('Consulta de reportes exitosa.');
    } catch (err) {
        logger.error('Error al consultar reportes:', err);
        res.status(500).json({
            ok: false,
            message: 'No se pudieron consultar los reportes. Intenta más tarde.'
        });
    }
});

// Endpoint para estadísticas de reportes
app.get('/api/reportes/stats', (req, res) => {
    try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        
        // Contar reportes del mes actual
        const reportesMes = db.prepare(`
            SELECT COUNT(*) as total 
            FROM reportes 
            WHERE fechaEnvio >= ?
        `).get(inicioMes.toISOString()).total;
        
        // Total de reportes
        const totalReportes = db.prepare('SELECT COUNT(*) as total FROM reportes').get().total;
        
        res.json({
            ok: true,
            mesActual: reportesMes,
            total: totalReportes
        });
        
        logger.info('Estadísticas de reportes consultadas exitosamente.');
    } catch (err) {
        logger.error('Error al consultar estadísticas de reportes:', err);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener estadísticas de reportes'
        });
    }
});

// Endpoint para estadísticas de equipos - total de equipos únicos
app.get('/api/equipos/stats', (req, res) => {
    try {
        // Contar equipos únicos por serie en los reportes
        const equiposUnicos = db.prepare(`
            SELECT COUNT(DISTINCT serie) as total 
            FROM reportes
        `).get().total;
        
        res.json({
            ok: true,
            total: equiposUnicos
        });
        
        logger.info(`Estadísticas de equipos: ${equiposUnicos} equipos únicos`);
    } catch (err) {
        logger.error('Error al consultar estadísticas de equipos:', err);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener estadísticas de equipos'
        });
    }
});

// Agregar esta ruta antes de app.listen
app.get('/api/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API de Biomedic-GoApp funcionando correctamente',
        endpoints: {
            reportes: '/api/reportes',
            reporte: '/api/reporte'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor backend escuchando en http://0.0.0.0:${PORT}`);
});