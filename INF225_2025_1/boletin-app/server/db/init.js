const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// Función para inicializar la base de datos
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
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
    
    // Verificar si ya existen roles
    const [roles] = await connection.query('SELECT * FROM roles');
    
    // Si no hay roles, insertar los roles predeterminados
    if (roles.length === 0) {
      await connection.query(`
        INSERT INTO roles (id, name, description) VALUES 
        (1, 'jefe', 'Acceso completo al sistema'),
        (2, 'empleado', 'Acceso a funciones operativas'),
        (3, 'usuario_publico', 'Acceso limitado a información pública')
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
