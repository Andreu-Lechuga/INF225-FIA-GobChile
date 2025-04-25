const { verifyToken } = require('../config/auth');

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  // Obtener el token del header de autorización
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. Token no proporcionado.' 
    });
  }
  
  // Verificar el token
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido o expirado.' 
    });
  }
  
  // Si el token es válido, guardar el usuario en el objeto request
  req.user = user;
  next();
};

// Middleware para verificar roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Verificar si el usuario tiene el rol requerido
    if (!req.user || !roles.includes(req.user.role_id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado. No tiene los permisos necesarios.' 
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
