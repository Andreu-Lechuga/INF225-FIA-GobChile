const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens JWT
// En un entorno de producción, esto debería estar en variables de entorno
const JWT_SECRET = 'boletin_app_secret_key';

// Opciones para los tokens JWT
const JWT_OPTIONS = {
  expiresIn: '24h' // El token expira en 24 horas
};

// Función para generar un token JWT
const generateToken = (user) => {
  // No incluir la contraseña en el token
  const { password, ...userWithoutPassword } = user;
  
  return jwt.sign(userWithoutPassword, JWT_SECRET, JWT_OPTIONS);
};

// Función para verificar un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};
