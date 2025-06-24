/**
 * Script de prueba para verificar que la corrección del rol funcione correctamente
 * Este script puede ejecutarse en la consola del navegador para probar el registro
 */

// Función para probar el registro con diferentes roles
async function testRoleRegistration() {
  console.log('🧪 Iniciando pruebas de registro de roles...');
  
  const testUsers = [
    {
      username: 'test-admin-' + Date.now(),
      email: `test-admin-${Date.now()}@example.com`,
      password: '123456',
      role: 'administrador'
    },
    {
      username: 'test-private-' + Date.now(),
      email: `test-private-${Date.now()}@example.com`,
      password: '123456',
      role: 'usuario-privado'
    },
    {
      username: 'test-public-' + Date.now(),
      email: `test-public-${Date.now()}@example.com`,
      password: '123456',
      role: 'usuario-publico'
    }
  ];
  
  for (const userData of testUsers) {
    try {
      console.log(`\n📝 Probando registro con rol: ${userData.role}`);
      console.log(`Email: ${userData.email}`);
      console.log(`Username: ${userData.username}`);
      
      // Simular el registro (esto requiere que el contexto esté disponible)
      if (window.authContext && window.authContext.signup) {
        const result = await window.authContext.signup(userData);
        console.log(`✅ Registro exitoso:`, result);
        
        // Verificar que el rol se haya guardado correctamente
        if (result.user && result.user.user_metadata) {
          const savedRole = result.user.user_metadata.role;
          if (savedRole === userData.role) {
            console.log(`✅ Rol guardado correctamente: ${savedRole}`);
          } else {
            console.error(`❌ Rol incorrecto. Esperado: ${userData.role}, Obtenido: ${savedRole}`);
          }
        }
      } else {
        console.warn('⚠️ Contexto de autenticación no disponible. Ejecutar desde la aplicación.');
      }
      
    } catch (error) {
      console.error(`❌ Error en registro con rol ${userData.role}:`, error);
    }
    
    // Esperar un poco entre registros
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Pruebas completadas');
}

// Función para verificar usuarios existentes en la base de datos
function generateSQLQueries() {
  console.log('📋 Consultas SQL para verificar la corrección:');
  
  const queries = [
    {
      name: 'Ver todos los usuarios y sus roles',
      sql: `
SELECT 
    u.email,
    u.raw_user_meta_data->>'username' as metadata_username,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.username,
    p.role as profile_role,
    u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;`
    },
    {
      name: 'Ver usuarios con roles incorrectos',
      sql: `
SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as intended_role,
    p.role as actual_role,
    u.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.raw_user_meta_data->>'role' != p.role
AND u.raw_user_meta_data->>'role' IS NOT NULL;`
    },
    {
      name: 'Contar usuarios por rol',
      sql: `
SELECT 
    role,
    COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;`
    },
    {
      name: 'Ver usuarios creados recientemente',
      sql: `
SELECT 
    u.email,
    p.username,
    p.role,
    u.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '1 hour'
ORDER BY u.created_at DESC;`
    }
  ];
  
  queries.forEach((query, index) => {
    console.log(`\n${index + 1}. ${query.name}:`);
    console.log(query.sql);
  });
}

// Función para verificar el estado actual del usuario
function checkCurrentUserRole() {
  console.log('👤 Verificando usuario actual...');
  
  if (window.authContext) {
    const { currentUser, userProfile } = window.authContext;
    
    console.log('Current User:', currentUser);
    console.log('User Profile:', userProfile);
    
    if (currentUser && userProfile) {
      console.log(`📧 Email: ${currentUser.email}`);
      console.log(`👤 Username: ${userProfile.username}`);
      console.log(`🎭 Rol en metadata: ${currentUser.user_metadata?.role || 'none'}`);
      console.log(`🎭 Rol en perfil: ${userProfile.role || 'none'}`);
      console.log(`✅ Email confirmado: ${currentUser.email_confirmed_at ? 'Sí' : 'No'}`);
      
      // Verificar consistencia
      const metadataRole = currentUser.user_metadata?.role;
      const profileRole = userProfile.role;
      
      if (metadataRole && profileRole && metadataRole === profileRole) {
        console.log('✅ Los roles son consistentes');
      } else if (metadataRole && profileRole && metadataRole !== profileRole) {
        console.warn('⚠️ Los roles no coinciden - posible problema');
      } else {
        console.log('ℹ️ Información de rol incompleta');
      }
    } else {
      console.log('❌ No hay usuario autenticado');
    }
  } else {
    console.warn('⚠️ Contexto de autenticación no disponible');
  }
}

// Función principal para ejecutar todas las pruebas
function runAllTests() {
  console.log('🚀 Ejecutando todas las pruebas de corrección de roles...\n');
  
  checkCurrentUserRole();
  generateSQLQueries();
  
  console.log('\n📝 Para probar el registro, ejecuta: testRoleRegistration()');
  console.log('⚠️ Nota: Las pruebas de registro requieren que la aplicación esté ejecutándose');
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  window.testRoleRegistration = testRoleRegistration;
  window.generateSQLQueries = generateSQLQueries;
  window.checkCurrentUserRole = checkCurrentUserRole;
  window.runAllTests = runAllTests;
  
  console.log('🔧 Funciones de prueba cargadas:');
  console.log('- testRoleRegistration(): Probar registro con diferentes roles');
  console.log('- generateSQLQueries(): Mostrar consultas SQL para verificación');
  console.log('- checkCurrentUserRole(): Verificar usuario actual');
  console.log('- runAllTests(): Ejecutar todas las pruebas');
}

// Ejecutar automáticamente si se carga el script
if (typeof window !== 'undefined' && window.location) {
  console.log('🔍 Script de prueba de roles cargado');
  console.log('Ejecuta runAllTests() para comenzar las pruebas');
}
