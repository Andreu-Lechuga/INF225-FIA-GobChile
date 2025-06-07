/**
 * Utilidades para debugging de autenticación
 */

import { supabase } from '../api/supabase';

// Función para verificar la configuración de Supabase
export const checkSupabaseConfig = () => {
  const config = {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
    hasAnonKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
  };
  
  console.log('Configuración de Supabase:', {
    ...config,
    anonKey: config.anonKey ? `${config.anonKey.substring(0, 10)}...` : 'No configurada'
  });
  
  return config.hasUrl && config.hasAnonKey;
};

// Función para verificar el estado de autenticación
export const checkAuthState = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error al obtener sesión:', error);
      return { success: false, error };
    }
    
    console.log('Estado de sesión:', {
      hasSession: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        emailConfirmed: !!session.user.email_confirmed_at,
        createdAt: session.user.created_at
      } : null
    });
    
    return { success: true, session };
  } catch (error) {
    console.error('Error en checkAuthState:', error);
    return { success: false, error };
  }
};

// Función para verificar si un usuario existe en la tabla profiles
export const checkUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error al obtener perfil:', error);
      return { success: false, error };
    }
    
    console.log('Perfil de usuario:', data);
    return { success: true, profile: data };
  } catch (error) {
    console.error('Error en checkUserProfile:', error);
    return { success: false, error };
  }
};

// Función para hacer un test completo de login
export const testLogin = async (email, password) => {
  console.log('=== INICIANDO TEST DE LOGIN ===');
  
  // 1. Verificar configuración
  console.log('1. Verificando configuración...');
  const configOk = checkSupabaseConfig();
  if (!configOk) {
    console.error('❌ Configuración de Supabase incompleta');
    return false;
  }
  console.log('✅ Configuración OK');
  
  // 2. Verificar estado inicial
  console.log('2. Verificando estado inicial...');
  await checkAuthState();
  
  // 3. Intentar login
  console.log('3. Intentando login...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Error en login:', error);
      return false;
    }
    
    console.log('✅ Login exitoso:', {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: !!data.user.email_confirmed_at
      } : null,
      session: !!data.session
    });
    
    // 4. Verificar perfil
    if (data.user) {
      console.log('4. Verificando perfil...');
      await checkUserProfile(data.user.id);
    }
    
    console.log('=== TEST COMPLETADO EXITOSAMENTE ===');
    return true;
    
  } catch (error) {
    console.error('❌ Error inesperado en login:', error);
    return false;
  }
};

// Función para hacer un test completo de signup
export const testSignup = async (email, password, username, role = 'usuario-publico') => {
  console.log('=== INICIANDO TEST DE SIGNUP ===');
  
  // 1. Verificar configuración
  console.log('1. Verificando configuración...');
  const configOk = checkSupabaseConfig();
  if (!configOk) {
    console.error('❌ Configuración de Supabase incompleta');
    return false;
  }
  console.log('✅ Configuración OK');
  
  // 2. Intentar signup
  console.log('2. Intentando signup...');
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role
        }
      }
    });
    
    if (error) {
      console.error('❌ Error en signup:', error);
      return false;
    }
    
    console.log('✅ Signup exitoso:', {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: !!data.user.email_confirmed_at
      } : null,
      session: !!data.session
    });
    
    console.log('=== TEST COMPLETADO EXITOSAMENTE ===');
    return true;
    
  } catch (error) {
    console.error('❌ Error inesperado en signup:', error);
    return false;
  }
};

// Función para limpiar la sesión
export const clearSession = async () => {
  try {
    await supabase.auth.signOut();
    console.log('✅ Sesión limpiada');
  } catch (error) {
    console.error('❌ Error al limpiar sesión:', error);
  }
};

export default {
  checkSupabaseConfig,
  checkAuthState,
  checkUserProfile,
  testLogin,
  testSignup,
  clearSession
};
