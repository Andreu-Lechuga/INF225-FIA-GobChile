# Instrucciones para Probar las Correcciones de Login

## Resumen de Correcciones Implementadas

Se han corregido los siguientes problemas en el sistema de autenticación:

### ✅ Problemas Resueltos
1. **Flujo de datos incorrecto** - Las funciones de Supabase ahora devuelven datos directamente
2. **Manejo de errores mejorado** - Mensajes específicos para diferentes tipos de error
3. **Actualización de estado** - El contexto actualiza inmediatamente después del login
4. **Carga de perfil** - Se carga automáticamente el perfil del usuario tras autenticación

## Pasos para Probar

### 1. Verificar Variables de Entorno
Asegúrate de que tienes configuradas las variables en `.env.local`:
```env
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
```

### 2. Ejecutar la Aplicación
```bash
npm start
```

### 3. Probar Registro (SignUp)
1. Ve a `/signup`
2. Completa el formulario con:
   - Email válido
   - Username único
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
   - Seleccionar rol
3. Enviar formulario
4. **Resultado esperado**: 
   - Mensaje de éxito
   - Si email confirmation está habilitado: mensaje para revisar email
   - Si no: redirección automática

### 4. Probar Login
1. Ve a `/login`
2. Usa las credenciales del usuario registrado
3. **Resultado esperado**: 
   - Login exitoso
   - Redirección a la página principal
   - Usuario autenticado en el contexto

### 5. Debugging (Si hay problemas)

#### Opción A: Usar Herramientas de Debug
Abre la consola del navegador y ejecuta:
```javascript
// Importar herramientas de debug
import { testLogin, checkSupabaseConfig } from './src/utils/debugAuth';

// Verificar configuración
checkSupabaseConfig();

// Probar login con debugging
await testLogin('tu-email@ejemplo.com', 'tu-password');
```

#### Opción B: Revisar Logs en Consola
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Intenta hacer login
4. Revisa los logs detallados que aparecen

### 6. Verificar en Supabase Dashboard

#### Verificar Usuarios
1. Ve a Supabase Dashboard → Authentication → Users
2. Confirma que el usuario existe
3. Verifica el estado (confirmed/unconfirmed)

#### Verificar Perfiles
1. Ve a Supabase Dashboard → Table Editor → profiles
2. Confirma que se creó el perfil automáticamente
3. Verifica que tiene username y role correctos

## Posibles Problemas y Soluciones

### Problema: "Credenciales inválidas"
**Posibles causas:**
- Email no confirmado (si está habilitado)
- Usuario no existe
- Contraseña incorrecta
- Configuración de Supabase incorrecta

**Solución:**
1. Verificar que el usuario existe en Supabase Auth
2. Si email confirmation está habilitado, confirmar email
3. Usar `testLogin()` para debugging detallado

### Problema: "Email not confirmed"
**Causa:** La confirmación de email está habilitada en Supabase
**Solución:**
1. Revisar email del usuario y confirmar cuenta
2. O deshabilitar confirmación de email en Supabase Dashboard

### Problema: Usuario se registra pero no puede hacer login
**Posibles causas:**
- Trigger de profiles no funciona
- Políticas RLS muy restrictivas
- Problema en la carga del perfil

**Solución:**
1. Verificar que existe el perfil en la tabla `profiles`
2. Revisar políticas RLS
3. Usar herramientas de debug

## Configuración de Email en Supabase

### Para Deshabilitar Confirmación de Email (Testing)
1. Ve a Supabase Dashboard → Authentication → Settings
2. En "Email Confirmation" → Desmarcar "Enable email confirmations"
3. Guardar cambios

### Para Habilitar Confirmación de Email (Producción)
1. Configurar SMTP en Supabase
2. Personalizar templates de email
3. Habilitar confirmación en Settings

## Comandos Útiles para Testing

### Limpiar Sesión
```javascript
import { clearSession } from './src/utils/debugAuth';
await clearSession();
```

### Verificar Estado de Autenticación
```javascript
import { checkAuthState } from './src/utils/debugAuth';
await checkAuthState();
```

### Test Completo de Signup
```javascript
import { testSignup } from './src/utils/debugAuth';
await testSignup('nuevo@email.com', 'password123', 'username', 'usuario-publico');
```

## Contacto para Soporte

Si después de seguir estos pasos el problema persiste:
1. Revisar logs detallados en la consola
2. Verificar configuración de Supabase
3. Comprobar que el schema SQL se ejecutó correctamente
4. Usar las herramientas de debug proporcionadas

Las correcciones implementadas deberían resolver el problema de login que experimentabas.
