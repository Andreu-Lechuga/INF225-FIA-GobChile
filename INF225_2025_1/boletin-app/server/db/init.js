const { pool, getConnection } = require('../config/db');
const bcrypt = require('bcrypt');

// Función para inicializar la base de datos
const initDatabase = async () => {
  try {
    // Obtener conexión sin especificar base de datos
    const connection = await pool.getConnection();
    
    // Crear base de datos si no existe
    const dbName = process.env.DB_NAME || 'boletines_db';
    console.log(`Creando base de datos ${dbName} si no existe...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    // Usar la base de datos
    console.log(`Usando base de datos ${dbName}...`);
    await connection.query(`USE ${dbName}`);
    
    // Crear tabla de roles si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de usuarios si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INT DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);
    
    // Crear tabla de boletines si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS boletines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(50) NOT NULL,
        temas JSON NOT NULL,
        plazo VARCHAR(10) NOT NULL,
        comentarios VARCHAR(200) NOT NULL,
        estado VARCHAR(30) NOT NULL DEFAULT 'Registrado',
        fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resultados_api JSON DEFAULT NULL COMMENT 'Almacena hasta 50 bloques de resultados de la API, cada bloque contiene [título, descripción, url]',
        CONSTRAINT chk_estado CHECK (estado IN ('Registrado', 'En proceso', 'Completado')),
        CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
      )
    `);
    
    // Verificar si ya existen roles
    const [roles] = await connection.query('SELECT * FROM roles');
    
    // Si no hay roles, insertar los roles actualizados
    if (roles.length === 0) {
      await connection.query(`
        INSERT INTO roles (id, name, description) VALUES 
        (1, 'administrador', 'Acceso completo al sistema'),
        (2, 'usuario-privado', 'Acceso a funciones operativas'),
        (3, 'usuario-publico', 'Acceso limitado a información pública')
      `);
      console.log('Roles predeterminados creados');
    }
    
    // Verificar si ya existe un usuario administrador
    const [admin] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    
    // Si no hay usuario administrador, crear uno
    if (admin.length === 0) {
      // Generar hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Insertar usuario administrador
      await connection.query(`
        INSERT INTO users (username, email, password, role_id) VALUES 
        (?, ?, ?, ?)
      `, ['admin', 'admin@example.com', hashedPassword, 1]);
      
      console.log('Usuario administrador creado');
    }
    
    console.log('Base de datos inicializada correctamente');
    connection.release();
    
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  }
};

// Exportar la función para poder usarla desde otros archivos
module.exports = {
  initDatabase
};

// Si este archivo se ejecuta directamente, inicializar la base de datos
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
