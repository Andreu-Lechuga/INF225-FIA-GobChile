import { createClient } from '@supabase/supabase-js';
import { handleSupabaseError } from '../utils/errorHandler';

// Configuración de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas correctamente');
}

// Cliente de Supabase para el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Funciones de utilidad para la base de datos
export const supabaseUtils = {
  // Función para obtener todos los boletines
  async getBoletines() {
    try {
      const { data, error } = await supabase
        .from('boletines')
        .select('*')
        .order('fecha_registro', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error al obtener boletines:', error);
      throw error;
    }
  },

  // Función para obtener un boletín por ID
  async getBoletinById(id) {
    try {
      const { data, error } = await supabase
        .from('boletines')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error al obtener boletín con ID ${id}:`, error);
      throw error;
    }
  },

  // Función para crear un nuevo boletín
  async createBoletin(boletinData) {
    try {
      const { data, error } = await supabase
        .from('boletines')
        .insert([boletinData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error al crear boletín:', error);
      throw error;
    }
  },

  // Función para actualizar un boletín
  async updateBoletin(id, updates) {
    try {
      const { data, error } = await supabase
        .from('boletines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error al actualizar boletín con ID ${id}:`, error);
      throw error;
    }
  },

  // Función para eliminar un boletín
  async deleteBoletin(id) {
    try {
      const { error } = await supabase
        .from('boletines')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar boletín con ID ${id}:`, error);
      throw error;
    }
  },

  // Función para suscribirse a cambios en tiempo real
  subscribeToBoletines(callback) {
    return supabase
      .channel('boletines-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'boletines' 
        }, 
        callback
      )
      .subscribe();
  }
};

// Funciones de autenticación
export const authUtils = {
  // Función para registrar un usuario
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          role: userData.role || 'usuario-publico'
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Función para iniciar sesión
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Función para cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Función para obtener el usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Función para obtener la sesión actual
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Función para suscribirse a cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Funciones para manejar perfiles de usuario
export const profileUtils = {
  // Obtener perfil del usuario actual (simplificado)
  async getCurrentProfile() {
    try {
      const user = await authUtils.getCurrentUser();
      if (!user) {
        console.log('getCurrentProfile: No user found');
        return null;
      }
      
      console.log('getCurrentProfile: Looking for profile with user ID:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores si no existe
      
      if (error) {
        console.error('getCurrentProfile: Database error:', error);
        throw error;
      }
      
      if (!data) {
        console.log('getCurrentProfile: Profile not found, will be created by trigger');
        return null; // El trigger debería crear el perfil automáticamente
      }
      
      console.log('getCurrentProfile: Profile found:', data);
      return data;
    } catch (err) {
      console.error('getCurrentProfile: Unexpected error:', err);
      throw err;
    }
  },

  // Obtener perfil por ID de usuario
  async getProfileById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Actualizar perfil del usuario actual
  async updateProfile(updates) {
    const user = await authUtils.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener todos los perfiles (solo para administradores)
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Verificar si un username está disponible
  async isUsernameAvailable(username, excludeUserId = null) {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username);
    
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data.length === 0;
  }
};

export default supabase;
