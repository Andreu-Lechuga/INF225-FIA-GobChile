/**
 * Script para probar que los roles se asignen correctamente
 * Ejecutar con: node test-role-assignment.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para limpiar usuarios de prueba
async function cleanupTestUsers() {
  console.log('🧹 Limpiando usuarios de prueba...');
  
  const testEmails = [
    'admin.test@example.com',
    'privado.test@example.com',
    'publico.test@example.com'
  ];
  
  for (const email of testEmails) {
    try {
      // Intentar hacer login y logout para limpiar
      const { data } = await supabase.auth.signInWithPassword({
        email,
        password: 'test123456'
      });
      
      if (data.user) {
        await supabase.auth.signOut();
        console.log(`🗑️  Usuario de prueba encontrado: ${email}`);
      }
    } catch (err) {
      // Usuario no existe, está bien
    }
  }
}

// Función para probar registro con rol específico
async function testSignupWithRole(email, username, role) {
  console.log(`\n📝 Probando registro con rol: ${role}`);
  console.log(`   Email: ${email}`);
  console.log(`   Username: ${username}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'test123456',
      options: {
        data: {
          username,
          role
        }
      }
    });
    
    if (error) {
      console.error(`❌ Error en registro:`, error.message);
      return false;
    }
    
    console.log(`✅ Usuario registrado exitosamente`);
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Email: ${data.user.email}`);
    
    // Esperar para que el trigger procese
    console.log('⏳ Esperando creación de perfil...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar perfil creado
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error(`❌ Error al verificar perfil:`, profileError.message);
      return false;
    }
    
    if (profile) {
      console.log(`✅ Perfil creado:`);
      console.log(`   Username: ${profile.username}`);
      console.log(`   Role: ${profile.role}`);
      
      // Verificar que el rol sea correcto
      if (profile.role === role) {
        console.log(`✅ ROL CORRECTO: ${profile.role} = ${role}`);
        return true;
      } else {
        console.log(`❌ ROL INCORRECTO: esperado '${role}', obtenido '${profile.role}'`);
        return false;
      }
    } else {
      console.log(`❌ Perfil no encontrado`);
      return false;
    }
    
  } catch (err) {
    console.error(`❌ Error inesperado:`, err.message);
    return false;
  }
}

// Función principal
async function runRoleTests() {
  console.log('🚀 Iniciando tests de asignación de roles...\n');
  
  // Limpiar usuarios de prueba
  await cleanupTestUsers();
  
  const tests = [
    {
      email: 'admin.test@example.com',
      username: 'admin_test',
      role: 'administrador'
    },
    {
      email: 'privado.test@example.com', 
      username: 'privado_test',
      role: 'usuario-privado'
    },
    {
      email: 'publico.test@example.com',
      username: 'publico_test', 
      role: 'usuario-publico'
    }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const success = await testSignupWithRole(test.email, test.username, test.role);
    if (success) {
      passedTests++;
    }
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RESULTADOS: ${passedTests}/${totalTests} tests pasaron`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('✅ Los roles se asignan correctamente');
    console.log('✅ El trigger funciona sin fallback');
    console.log('✅ Cada rol seleccionado se guarda exactamente');
  } else {
    console.log('❌ ALGUNOS TESTS FALLARON');
    console.log('⚠️  Revisa los logs del trigger en Supabase Dashboard');
    console.log('⚠️  Ve a Dashboard → Logs para ver detalles');
  }
  
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si todos los tests pasaron: ¡El problema está resuelto!');
  console.log('2. Si falló algún test: Revisa los logs en Supabase Dashboard');
  console.log('3. Ejecuta el script fix-role-trigger-corrected.sql si es necesario');
}

// Ejecutar tests
runRoleTests().catch(console.error);
