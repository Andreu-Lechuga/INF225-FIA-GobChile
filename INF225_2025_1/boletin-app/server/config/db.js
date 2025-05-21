const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password-mysql',
  // No especificar la base de datos aquí para poder crearla primero
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para obtener una conexión a una base de datos específica
const getConnection = async (database) => {
  const connection = await pool.getConnection();
  if (database) {
    await connection.query(`USE ${database}`);
  }
  return connection;
};

// Función para probar la conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos MySQL establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos MySQL:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  getConnection
};
