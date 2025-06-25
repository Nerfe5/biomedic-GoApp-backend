# Biomedic-GoApp Backend

## Overview
Biomedic-GoApp is a backend application designed to handle reports of medical equipment failures. It utilizes Node.js with Express for the server framework and SQLite as the database for storing report data.

## Project Structure
```
biomedic-GoApp-backend
├── db
│   └── database.sqlite        # SQLite database file
├── nginx
│   └── biomedic-app.conf     # Nginx configuration file
├── server.js                 # Main entry point
├── ecosystem.config.js       # PM2 configuration
├── start.sh                  # Service startup script
├── package.json             
└── README.md                
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd biomedic-GoApp-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   pm2 install pm2-logrotate    # For log management
   ```

3. **Configure Environment Variables**
   Create a `.env` file:
   ```
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   ```

4. **Configure Nginx**
   ```bash
   sudo cp nginx/biomedic-app.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/biomedic-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Start Services**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## Available URLs

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8080/api`
- Backend Documentation: `http://localhost:8080/docs`

## API Endpoints

### POST `/api/reporte`
Submit a new equipment failure report:
```json
{
    "correo": "recipient@example.com",
    "equipo": "Equipment Name",
    "marca": "Brand Name",
    "modelo": "Model Name",
    "serie": "Serial Number",
    "ubicacion": "Location",
    "proveedor": "Provider Name",
    "falla": "Description of the failure",
    "nombre": "Your Name",
    "puesto": "Your Position",
    "matricula": "Your ID",
    "fecha": "Submission Date"
}
```

### GET `/api/reportes`
Retrieve all stored reports.

## Production Setup

### Daily Startup
To start all services:
```bash
cd /home/alejandro/biomedic-GoApp-backend
./start.sh
```

### Network Access
To access from other devices in the local network:
1. Use: `http://[IP-OF-SERVER]:8080`
2. Ensure devices are on the same network
3. Configure Windows Firewall if using WSL:
   ```powershell
   # Run in PowerShell as Administrator
   netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=localhost
   ```

### Process Management
Monitor application status:
```bash
pm2 status
pm2 logs
```

## License
This project is licensed under the MIT License.