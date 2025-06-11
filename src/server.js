// filepath: biomedic-GoApp-backend/src/server.js
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initialize database
db.initializeDatabase();

// Ruta para recibir el formulario
app.post('/api/reporte', async (req, res) => {
    console.log('--- INICIO /api/reporte ---');
    try {
        console.log('Cuerpo recibido:', req.body);

        // Guardar evidencia en archivo JSON
        const reportPath = path.join(__dirname, '../reportes.json');
        let reportes = [];
        if (fs.existsSync(reportPath)) {
            console.log('Leyendo archivo reportes.json...');
            reportes = JSON.parse(fs.readFileSync(reportPath));
        }
        reportes.push({ ...req.body, fechaEnvio: new Date().toISOString() });
        fs.writeFileSync(reportPath, JSON.stringify(reportes, null, 2));
        console.log('Reporte guardado en archivo.');

        // Guardar reporte en la base de datos
        await db.insertReport(req.body);
        console.log('Reporte guardado en la base de datos.');

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
        console.log('Transporter SMTP creado.');

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
        console.log('Correo enviado correctamente.');

        res.json({ ok: true, message: 'Reporte enviado y almacenado correctamente.' });
        console.log('Respuesta enviada al frontend.');
    } catch (err) {
        console.error('Error en /api/reporte:', err);
        res.status(500).json({ ok: false, message: 'Error al enviar el correo.', error: err.message });
    }
    console.log('--- FIN /api/reporte ---');
});

app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});