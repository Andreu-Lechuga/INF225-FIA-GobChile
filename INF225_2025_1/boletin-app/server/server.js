const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const { initDatabase } = require('./db/init');
const authRoutes = require('./routes/authRoutes');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permitir solicitudes CORS
app.use(express.json()); // Parsear solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Parsear solicitudes URL-encoded

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Boletín de Agricultura funcionando correctamente' });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    // Probar la conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('No se pudo conectar a la base de datos. Asegúrese de que MySQL esté en ejecución.');
      process.exit(1);
    }
    
    // Inicializar la base de datos
    await initDatabase();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Si este archivo se ejecuta directamente, iniciar el servidor
if (require.main === module) {
  startServer();
}

module.exports = app; // Exportar para pruebas
