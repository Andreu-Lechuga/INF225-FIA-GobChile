# Guía de Autenticación con Supabase

## Resumen de Cambios Implementados

Se ha actualizado completamente la implementación de autenticación para usar Supabase con las siguientes mejoras:

### 1. Esquema de Base de Datos Actualizado

#### Tabla `profiles`
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'usuario-publico',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT chk_role CHECK (role IN ('administrador', 'usuario-privado', 'usuario-publico'))
);
```

#### Características:
- **Trigger automático**: Crea un perfil automáticamente cuando se registra un usuario
- **RLS habilitado**: Políticas de seguridad configuradas
- **Roles definidos**: administrador, usuario-privado, usuario-publico

### 2. Funciones de API Actualizadas

#### `authUtils` - Funciones de Autenticación
- `signUp(email, password, userData)`: Registro con metadata
- `signIn(email, password)`: Login con email
- `signOut()`: Cerrar sesión
- `getCurrentUser()`: Obtener usuario actual
- `getCurrentSession()`: Obtener sesión actual
- `onAuthStateChange(callback)`: Suscribirse a cambios

#### `profileUtils` - Funciones de Perfiles
- `getCurrentProfile()`: Obtener perfil del usuario actual
- `getProfileById(userId)`: Obtener perfil por ID
- `updateProfile(updates)`: Actualizar perfil
- `getAllProfiles()`: Obtener todos los perfiles (admin)
- `isUsernameAvailable(username)`: Verificar disponibilidad

### 3. Contexto de Autenticación Mejorado

#### Estados disponibles:
- `currentUser`: Usuario de Supabase Auth
- `userProfile`: Perfil de la tabla profiles
- `session`: Sesión actual
- `loading`: Estado de carga
- `error`: Errores de autenticación

#### Funciones disponibles:
- `signup(userData)`: Registrar usuario
- `login(credentials)`: Iniciar sesión
- `logout()`: Cerrar sesión
- `hasRole(role)`: Verificar rol
- `loadUserProfile()`: Cargar perfil

### 4. Componentes Actualizados

#### Login.js
- **Campo cambiado**: `username` → `email`
- **Validación**: Email válido requerido
- **Integración**: Usa el contexto actualizado

#### SignUp.js
- **Campos**: email, username, password, confirmPassword, role
- **Roles**: Dropdown con opciones válidas
- **Validación**: Email único y username único

## Flujo de Autenticación

### Registro de Usuario
1. Usuario completa formulario con email, username, password, role
2. `authUtils.signUp()` crea usuario en Supabase Auth con metadata
3. Trigger automático crea registro en tabla `profiles`
4. Usuario recibe email de confirmación (si está habilitado)

### Inicio de Sesión
1. Usuario ingresa email y password
2. `authUtils.signIn()` autentica con Supabase
3. Contexto carga automáticamente el perfil asociado
4. `userProfile` queda disponible con username y role

### Verificación de Roles
```javascript
const { hasRole } = useAuth();

// Verificar roles
if (hasRole('administrador')) {
  // Acceso completo
}
if (hasRole('usuario-privado')) {
  // Acceso parcial
}
if (hasRole('usuario-publico')) {
  // Acceso limitado
}
```

## Configuración Requerida

### Variables de Entorno
```env
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
```

### Ejecutar Schema SQL
1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar el contenido de `supabase-schema.sql`
3. Verificar que las tablas y triggers se crearon correctamente

## Uso en Componentes

### Hook de Autenticación
```javascript
import { useAuth } from '../context';

const MiComponente = () => {
  const { 
    currentUser, 
    userProfile, 
    loading, 
    hasRole, 
    logout 
  } = useAuth();

  if (loading) return <div>Cargando...</div>;
  
  if (!currentUser) return <div>No autenticado</div>;

  return (
    <div>
      <h1>Bienvenido, {userProfile?.username}</h1>
      <p>Rol: {userProfile?.role}</p>
      
      {hasRole('administrador') && (
        <button>Panel de Administración</button>
      )}
      
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

### Protección de Rutas
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, hasRole, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <div>Acceso denegado</div>;
  }
  
  return children;
};
```

## Políticas RLS Configuradas

### Tabla `profiles`
- Los usuarios pueden ver y actualizar su propio perfil
- Los administradores pueden ver todos los perfiles
- Solo usuarios autenticados pueden acceder

### Tabla `boletines`
- Usuarios autenticados pueden leer, crear, actualizar y eliminar
- Se puede personalizar según roles específicos

## Correcciones Implementadas (Actualización)

### Problemas Resueltos

#### 1. **Flujo de Datos Corregido**
- ✅ Eliminado el wrapper `{ success: true, data }` de `supabaseUtils`
- ✅ Las funciones ahora devuelven datos directamente o lanzan errores
- ✅ Contexto actualizado para manejar respuestas correctamente

#### 2. **Manejo de Errores Mejorado**
- ✅ Errores específicos de Supabase con mensajes claros
- ✅ Distinción entre "credenciales inválidas" y "email no confirmado"
- ✅ Logging detallado para debugging

#### 3. **Contexto de Autenticación Optimizado**
- ✅ Actualización inmediata del estado después de login/signup
- ✅ Carga de perfil automática tras autenticación exitosa
- ✅ Manejo robusto de errores de perfil

#### 4. **Componentes Mejorados**
- ✅ Login.js con mejor feedback visual y manejo de errores
- ✅ SignUp.js con mensajes de confirmación de email
- ✅ Estados de carga más precisos

#### 5. **Debugging Tools**
- ✅ Nuevo archivo `debugAuth.js` para diagnosticar problemas
- ✅ Funciones de test para login y signup
- ✅ Verificación de configuración automática

### Uso de Herramientas de Debug

Para diagnosticar problemas de autenticación, puedes usar:

```javascript
import { testLogin, checkSupabaseConfig } from '../utils/debugAuth';

// Verificar configuración
checkSupabaseConfig();

// Probar login con debugging detallado
await testLogin('usuario@email.com', 'password123');
```

### Flujo de Autenticación Actualizado

#### Login Corregido
1. Usuario ingresa credenciales
2. `authUtils.signIn()` autentica con Supabase
3. **NUEVO**: Contexto actualiza estado inmediatamente
4. **NUEVO**: Carga perfil automáticamente
5. Redirección exitosa

#### Manejo de Errores Específicos
- `Invalid login credentials` → "Credenciales inválidas. Verifique su email y contraseña."
- `Email not confirmed` → "Debe confirmar su email antes de iniciar sesión."
- `Too many requests` → "Demasiados intentos. Espere unos minutos."

## Próximos Pasos

1. **Ejecutar el schema SQL** en tu proyecto Supabase
2. **Configurar variables de entorno** con tus credenciales
3. **Probar registro y login** con los componentes actualizados
4. **Usar herramientas de debug** si hay problemas
5. **Verificar configuración de email** en Supabase Dashboard
6. **Personalizar políticas RLS** según tus necesidades específicas
7. **Implementar protección de rutas** basada en roles

## Notas Importantes

- Los usuarios deben usar **email** para iniciar sesión
- El **username** es solo para visualización interna
- Los **roles** están definidos en la base de datos y son validados
- Las **políticas RLS** están habilitadas para seguridad
- Los **triggers** crean automáticamente los perfiles de usuario
- **NUEVO**: Si el login falla, revisa la consola del navegador para logs detallados
- **NUEVO**: Usa `debugAuth.js` para diagnosticar problemas específicos

## Solución de Problemas Comunes

### Login Falla con "Credenciales Inválidas"
1. Verificar que el usuario existe en Supabase Auth
2. Verificar que el email está confirmado (si está habilitado)
3. Usar `testLogin()` para debugging detallado
4. Revisar configuración de variables de entorno

### Usuario se Registra pero no Puede Hacer Login
1. Verificar si la confirmación de email está habilitada
2. Revisar que el trigger de profiles funciona correctamente
3. Verificar políticas RLS de la tabla profiles
