const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuración de la base de datos
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'password-mysql'; // password-mysql
const DB_NAME = process.env.DB_NAME || 'boletines_db';
const DB_PORT = process.env.DB_PORT || 3306;

// Crear instancia de Sequelize sin especificar la base de datos
let sequelize;

// Función para inicializar Sequelize con una base de datos específica
const initSequelize = async () => {
  try {
    // Primero, crear una conexión sin especificar la base de datos
    const tempSequelize = new Sequelize('', DB_USER, DB_PASS, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
      logging: false
    });
    
    // Crear la base de datos si no existe
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await tempSequelize.close();
    
    // Ahora crear la conexión real con la base de datos
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    return sequelize;
  } catch (error) {
    console.error('Error al inicializar Sequelize:', error);
    throw error;
  }
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    // Inicializar Sequelize si aún no se ha hecho
    if (!sequelize) {
      await initSequelize();
    }
    
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  initSequelize
};
