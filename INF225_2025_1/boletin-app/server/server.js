const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/supabase');
const { initializeDatabase } = require('./config/initDatabase');
const boletinRoutes = require('./routes/boletinRoutes');

// Crear la aplicación Express
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors()); // Permitir solicitudes CORS
app.use(express.json()); // Parsear solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Parsear solicitudes URL-encoded

// Rutas
app.use('/api/boletines', boletinRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Boletín de Agricultura funcionando correctamente' });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    // Probar la conexión a Supabase
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('No se pudo conectar a Supabase. Verifique las variables de entorno.');
      process.exit(1);
    }
    
    // Inicializar la base de datos (crear tabla y datos de ejemplo si es necesario)
    console.log('🔄 Inicializando base de datos...');
    await initializeDatabase();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log('Conectado a Supabase exitosamente');
      console.log('Base de datos inicializada correctamente');
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
