const { pool } = require('../config/db');
const { generateToken } = require('../config/auth');
const bcrypt = require('bcrypt');

// Controlador para el registro de usuarios
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validar datos de entrada
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, proporcione todos los campos requeridos.'
      });
    }
    
    const connection = await pool.getConnection();
    
    // Verificar si el usuario ya existe
    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario o correo electrónico ya está en uso.'
      });
    }
    
    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Obtener el rol del usuario (si no se proporciona, usar usuario_publico = 3 por defecto)
    const roleMap = {
      'administrador': 1,
      'usuario-privado': 2,
      'usuario-publico': 3
    };
    
    const role = req.body.role || 'usuario-publico';
    const roleId = roleMap[role] || 3;
    
    // Insertar nuevo usuario con el rol especificado
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, roleId]
    );
    
    // Obtener el usuario recién creado
    const [newUser] = await connection.query(
      'SELECT id, username, email, role_id FROM users WHERE id = ?',
      [result.insertId]
    );
    
    connection.release();
    
    // Generar token JWT
    const token = generateToken(newUser[0]);
    
    // Responder con el usuario y el token
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      user: newUser[0],
      token
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar usuario.',
      error: error.message
    });
  }
};

// Controlador para el inicio de sesión
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validar datos de entrada
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, proporcione el nombre de usuario y la contraseña.'
      });
    }
    
    const connection = await pool.getConnection();
    
    // Buscar usuario por nombre de usuario o email
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    
    connection.release();
    
    // Verificar si el usuario existe
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }
    
    const user = users[0];
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }
    
    // Eliminar la contraseña del objeto usuario
    const { password: _, ...userWithoutPassword } = user;
    
    // Generar token JWT
    const token = generateToken(userWithoutPassword);
    
    // Responder con el usuario y el token
    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.',
      error: error.message
    });
  }
};

// Controlador para obtener el perfil del usuario
const getProfile = async (req, res) => {
  try {
    // El usuario ya está disponible en req.user gracias al middleware de autenticación
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener perfil de usuario.',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
