#!/bin/bash

echo "🚀 Iniciando servicios de Biomedic-GoApp..."

# Iniciar Nginx
echo "📡 Iniciando Nginx..."
sudo systemctl start nginx

# Iniciar la aplicación backend con PM2
echo "🔄 Iniciando backend..."
cd /home/alejandro/biomedic-GoApp-backend
pm2 start ecosystem.config.js

echo "✅ Servicios iniciados correctamente!"
echo "📝 URLs disponibles:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:8080/api"
echo "   Backend Docs: http://localhost:8080/docs"
