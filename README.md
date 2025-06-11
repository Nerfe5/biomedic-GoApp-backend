# Biomedic-GoApp Backend

## Overview
Biomedic-GoApp is a backend application designed to handle reports of medical equipment failures. It utilizes Node.js with Express for the server framework and SQLite as the database for storing report data.

## Project Structure
```
biomedic-GoApp-backend
├── db
│   └── database.sqlite        # SQLite database file for storing report data
├── src
│   ├── server.js             # Main entry point of the application
│   └── db.js                 # Database connection logic and functions
├── reportes.json             # Backup or log of report data in JSON format
├── package.json              # npm configuration file with project dependencies
├── .env                      # Environment variables for sensitive information
└── README.md                 # Documentation for the project
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd biomedic-GoApp-backend
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your SMTP configuration:
   ```
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   ```

4. **Run the Application**
   Start the server with:
   ```bash
   node src/server.js
   ```
   The server will be running on `http://localhost:3001`.

## Usage
To submit a report, send a POST request to the `/api/reporte` endpoint with the following JSON structure:
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

## License
This project is licensed under the MIT License. See the LICENSE file for more details.