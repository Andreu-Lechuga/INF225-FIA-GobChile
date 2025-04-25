import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto de Boletines
const BoletinesContext = createContext();

// Contexto de Autenticación
const AuthContext = createContext();

// Hooks personalizados para usar los contextos
export const useBoletines = () => useContext(BoletinesContext);
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de Boletines
export const BoletinesProvider = ({ children }) => {
  // Estado para almacenar los boletines
  const [boletines, setBoletines] = useState([]);
  
  // Función para agregar un nuevo boletín
  const agregarBoletin = (boletin) => {
    setBoletines([...boletines, { ...boletin, id: Date.now() }]);
  };

  // Función para obtener todos los boletines
  const obtenerBoletines = () => {
    return boletines;
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    boletines,
    agregarBoletin,
    obtenerBoletines
  };

  return (
    <BoletinesContext.Provider value={value}>
      {children}
    </BoletinesContext.Provider>
  );
};

// Simulación de base de datos de usuarios (para desarrollo)
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role_id: 1,
    role: 'jefe'
  },
  {
    id: 2,
    username: 'empleado',
    email: 'empleado@example.com',
    password: 'empleado123',
    role_id: 2,
    role: 'empleado'
  },
  {
    id: 3,
    username: 'usuario',
    email: 'usuario@example.com',
    password: 'usuario123',
    role_id: 3,
    role: 'usuario_publico'
  }
];

// Proveedor del contexto de Autenticación
export const AuthProvider = ({ children }) => {
  // Estados para la autenticación
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState(() => {
    // Cargar usuarios desde localStorage o usar los mock users
    const storedUsers = localStorage.getItem('mockUsers');
    return storedUsers ? JSON.parse(storedUsers) : mockUsers;
  });
  
  // Guardar usuarios en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }, [users]);
  
  // Efecto para cargar el usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Función para registrar un nuevo usuario
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar si el usuario ya existe
      const userExists = users.some(
        user => user.username === userData.username || user.email === userData.email
      );
      
      if (userExists) {
        throw new Error('El nombre de usuario o correo electrónico ya está en uso.');
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password, // En una app real, esto debería estar hasheado
        role_id: 3, // Usuario público por defecto
        role: 'usuario_publico'
      };
      
      // Actualizar lista de usuarios
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Guardar usuario en localStorage
      const userToStore = { ...newUser };
      delete userToStore.password; // No almacenar la contraseña en el cliente
      
      localStorage.setItem('user', JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      
      return userToStore;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar usuario por nombre de usuario o email
      const user = users.find(
        u => (u.username === credentials.username || u.email === credentials.username) && 
             u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Credenciales inválidas.');
      }
      
      // Crear objeto de usuario sin la contraseña
      const userToStore = { ...user };
      delete userToStore.password;
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      
      return userToStore;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (roleId) => {
    return currentUser && currentUser.role_id === roleId;
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Proveedor combinado para usar ambos contextos
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <BoletinesProvider>
        {children}
      </BoletinesProvider>
    </AuthProvider>
  );
};
