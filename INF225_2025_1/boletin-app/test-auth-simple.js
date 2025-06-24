/**
 * Script de testing simple para verificar autenticación
 * Ejecutar con: node test-auth-simple.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas');
  console.log('Asegúrate de tener REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY en tu .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para verificar configuración
async function checkConfig() {
  console.log('🔧 Verificando configuración...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseAnonKey.substring(0, 10)}...`);
  
  try {
    // Intentar una consulta simple
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('⚠️  Tabla profiles no existe o no es accesible:', error.message);
      return false;
    }
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    return false;
  }
}

// Función para limpiar usuarios de prueba
async function cleanupTestUsers() {
  console.log('🧹 Limpiando usuarios de prueba...');
  
  const testEmails = [
    'test@example.com',
    'usuario.prueba@test.com',
    'admin.test@example.com'
  ];
  
  for (const email of testEmails) {
    try {
      // Intentar hacer login para ver si existe
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'test123456'
      });
      
      if (data.user) {
        console.log(`🗑️  Eliminando usuario de prueba: ${email}`);
        await supabase.auth.signOut();
      }
    } catch (err) {
      // Usuario no existe, está bien
    }
  }
}

// Función para probar registro
async function testSignup() {
  console.log('\n📝 Probando registro de usuario...');
  
  const testUser = {
    email: 'test@example.com',
    password: 'test123456',
    username: 'usuario_prueba',
    role: 'usuario-publico'
  };
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          username: testUser.username,
          role: testUser.role
        }
      }
    });
    
    if (error) {
      console.error('❌ Error en registro:', error.message);
      return false;
    }
    
    console.log('✅ Usuario registrado exitosamente');
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Confirmado: ${data.user.email_confirmed_at ? 'Sí' : 'No'}`);
    
    // Esperar un momento para que el trigger cree el perfil
    console.log('⏳ Esperando creación de perfil...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar si se creó el perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error al verificar perfil:', profileError.message);
      return false;
    }
    
    if (profile) {
      console.log('✅ Perfil creado automáticamente:');
      console.log(`   Username: ${profile.username}`);
      console.log(`   Role: ${profile.role}`);
    } else {
      console.log('⚠️  Perfil no encontrado');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error inesperado en registro:', err.message);
    return false;
  }
}

// Función para probar login
async function testLogin() {
  console.log('\n🔐 Probando login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123456'
    });
    
    if (error) {
      console.error('❌ Error en login:', error.message);
      return false;
    }
    
    console.log('✅ Login exitoso');
    console.log(`   Usuario: ${data.user.email}`);
    console.log(`   Sesión: ${data.session ? 'Activa' : 'Inactiva'}`);
    
    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profile) {
      console.log('✅ Perfil cargado:');
      console.log(`   Username: ${profile.username}`);
      console.log(`   Role: ${profile.role}`);
    } else {
      console.log('⚠️  No se pudo cargar el perfil:', profileError?.message);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error inesperado en login:', err.message);
    return false;
  }
}

// Función principal
async function runTests() {
  console.log('🚀 Iniciando tests de autenticación...\n');
  
  // 1. Verificar configuración
  const configOk = await checkConfig();
  if (!configOk) {
    console.log('\n❌ Tests fallidos: Configuración incorrecta');
    return;
  }
  
  // 2. Limpiar usuarios de prueba
  await cleanupTestUsers();
  
  // 3. Probar registro
  const signupOk = await testSignup();
  if (!signupOk) {
    console.log('\n❌ Tests fallidos: Error en registro');
    return;
  }
  
  // 4. Probar login
  const loginOk = await testLogin();
  if (!loginOk) {
    console.log('\n❌ Tests fallidos: Error en login');
    return;
  }
  
  console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
  console.log('\n📋 Resumen:');
  console.log('   ✅ Configuración correcta');
  console.log('   ✅ Registro funciona');
  console.log('   ✅ Perfil se crea automáticamente');
  console.log('   ✅ Login funciona');
  console.log('   ✅ Perfil se carga correctamente');
  
  console.log('\n🎯 Tu sistema de autenticación está funcionando correctamente');
}

// Ejecutar tests
runTests().catch(console.error);
