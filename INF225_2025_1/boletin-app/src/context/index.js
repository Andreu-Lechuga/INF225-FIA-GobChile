import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabaseUtils, authUtils, profileUtils } from '../api/supabase';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Función para cargar boletines desde Supabase
  const cargarBoletines = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await supabaseUtils.getBoletines();
      setBoletines(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar boletines');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo boletín
  const agregarBoletin = async (boletinData) => {
    try {
      setLoading(true);
      setError('');
      const nuevoBoletin = await supabaseUtils.createBoletin(boletinData);
      setBoletines(prev => [nuevoBoletin, ...prev]);
      return nuevoBoletin;
    } catch (err) {
      setError(err.message || 'Error al crear boletín');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un boletín
  const actualizarBoletin = async (id, updates) => {
    try {
      setLoading(true);
      setError('');
      const boletinActualizado = await supabaseUtils.updateBoletin(id, updates);
      setBoletines(prev => 
        prev.map(boletin => 
          boletin.id === id ? boletinActualizado : boletin
        )
      );
      return boletinActualizado;
    } catch (err) {
      setError(err.message || 'Error al actualizar boletín');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un boletín
  const eliminarBoletin = async (id) => {
    try {
      setLoading(true);
      setError('');
      await supabaseUtils.deleteBoletin(id);
      setBoletines(prev => prev.filter(boletin => boletin.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar boletín');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todos los boletines
  const obtenerBoletines = () => {
    return boletines;
  };

  // No cargar boletines automáticamente al inicializar
  // Los boletines se cargarán cuando sea necesario y el usuario esté autenticado

  // Valores que se proporcionarán a través del contexto
  const value = {
    boletines,
    loading,
    error,
    cargarBoletines,
    agregarBoletin,
    actualizarBoletin,
    eliminarBoletin,
    obtenerBoletines
  };

  return (
    <BoletinesContext.Provider value={value}>
      {children}
    </BoletinesContext.Provider>
  );
};

// Proveedor del contexto de Autenticación con Supabase
export const AuthProvider = ({ children }) => {
  // Estados para la autenticación
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Función para cargar el perfil del usuario
  const loadUserProfile = async (user) => {
    if (!user) {
      console.log('loadUserProfile: No user provided');
      setUserProfile(null);
      return;
    }
    
    // Crear perfil inmediatamente con datos disponibles
    const immediateProfile = {
      id: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuario',
      role: user.user_metadata?.role || 'usuario-publico',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setUserProfile(immediateProfile);
    
    // Intentar cargar desde la base de datos en segundo plano
    try {
      const dbProfile = await profileUtils.getCurrentProfile();
      if (dbProfile) {
        setUserProfile(dbProfile);
      }
    } catch (err) {
      console.error('loadUserProfile: Database error (using fallback):', err);
      // Mantener el perfil inmediato si hay error en la base de datos
    }
  };

  // Efecto para cargar la sesión inicial y suscribirse a cambios
  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const currentSession = await authUtils.getCurrentSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setCurrentUser(currentSession.user);
          setLoading(false); // Establecer loading en false inmediatamente
          loadUserProfile(currentSession.user); // Cargar perfil en segundo plano
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error al obtener sesión inicial:', err);
        setLoading(false);
      }
    };

    getInitialSession();

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = authUtils.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          setLoading(false); // Establecer loading en false inmediatamente
          loadUserProfile(session.user); // Cargar perfil en segundo plano
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Función para registrar un nuevo usuario
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const { email, password, username, role } = userData;
      
      // Usar los roles directamente como están definidos en la base de datos
      const result = await authUtils.signUp(email, password, {
        username,
        role: role || 'usuario-publico'
      });
      
      // Si el registro es exitoso, actualizar el estado inmediatamente
      if (result.user) {
        setCurrentUser(result.user);
        setSession(result.session);
        // Cargar perfil si el usuario está confirmado
        if (result.user.email_confirmed_at) {
          await loadUserProfile(result.user);
        }
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      console.error('Error en signup:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const { email, password } = credentials;
      
      // Usar email directamente para login
      const result = await authUtils.signIn(email, password);
      
      // Si el login es exitoso, actualizar el estado inmediatamente
      if (result.user && result.session) {
        setCurrentUser(result.user);
        setSession(result.session);
        
        // Cargar perfil del usuario
        try {
          await loadUserProfile(result.user);
        } catch (profileError) {
          console.warn('Error al cargar perfil:', profileError);
          // No fallar el login si no se puede cargar el perfil
        }
      }
      
      return result;
    } catch (err) {
      let errorMessage = 'Error al iniciar sesión';
      
      // Manejar errores específicos de Supabase
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Verifique su email y contraseña.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Debe confirmar su email antes de iniciar sesión. Revise su bandeja de entrada.';
        } else if (err.message.includes('Too many requests')) {
          errorMessage = 'Demasiados intentos. Espere unos minutos antes de intentar nuevamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error en login:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      setError('');
      await authUtils.signOut();
    } catch (err) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!userProfile?.role) return false;
    
    // Usar directamente el rol de la tabla profiles
    return userProfile.role === role;
  };

  // Función para obtener el usuario actual
  const getCurrentUser = async () => {
    try {
      return await authUtils.getCurrentUser();
    } catch (err) {
      console.error('Error al obtener usuario actual:', err);
      return null;
    }
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    currentUser,
    userProfile,
    session,
    loading,
    error,
    signup,
    login,
    logout,
    hasRole,
    getCurrentUser,
    loadUserProfile
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
