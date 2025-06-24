# Guía para Corregir el Problema del Rol en Login/Signup

## Problema Identificado

El sistema de login/signup no estaba capturando correctamente el rol seleccionado por el usuario durante el registro. Los usuarios seleccionaban "Administrador" pero el sistema los registraba como "usuario-publico".

## Causa del Problema

El problema estaba en el trigger de la base de datos `handle_new_user()` que no extraía correctamente el rol de los metadatos del usuario (`raw_user_meta_data`).

## Solución Implementada

### 1. Corrección del Trigger de Base de Datos

Se actualizó la función `handle_new_user()` en `supabase-schema.sql` con:

- **Mejor manejo de errores**: Uso de bloques `DECLARE` y `EXCEPTION`
- **Validación de roles**: Verificación que el rol sea uno de los permitidos
- **Logging mejorado**: Mensajes de log para debugging
- **Fallback robusto**: Manejo de errores con valores por defecto

### 2. Mejoras en el Contexto de Autenticación

Se mejoró la función `signup` en `src/context/index.js` con:

- **Validación del rol**: Verificación antes de enviar a Supabase
- **Perfil temporal**: Creación de perfil temporal con el rol correcto
- **Logging mejorado**: Mensajes de consola para debugging
- **Manejo de errores**: Mejor gestión de errores de perfil

## Archivos Modificados

1. **`supabase-schema.sql`**: Trigger corregido
2. **`fix-role-trigger.sql`**: Script de corrección independiente
3. **`src/context/index.js`**: Contexto de autenticación mejorado

## Cómo Aplicar las Correcciones

### Opción 1: Aplicar Solo el Trigger (Recomendado)

```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar el contenido de fix-role-trigger.sql
```

### Opción 2: Recrear Toda la Base de Datos

```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar el contenido completo de supabase-schema.sql
```

## Cómo Probar la Corrección

### 1. Probar Registro de Nuevo Usuario

1. Ir a la página de registro (`/signup`)
2. Llenar el formulario:
   - Nombre de Usuario: `test-admin`
   - Email: `test-admin@example.com`
   - Contraseña: `123456`
   - Confirmar Contraseña: `123456`
   - **Rol**: Seleccionar "Administrador"
3. Hacer clic en "Registrarse"
4. Verificar en la consola del navegador los logs:
   ```
   Registrando usuario con rol: administrador
   Resultado del registro: [objeto con user data]
   ```

### 2. Verificar en la Base de Datos

```sql
-- Consultar la tabla profiles para verificar el rol
SELECT id, username, role, created_at 
FROM profiles 
WHERE username = 'test-admin';
```

**Resultado esperado**: El rol debe ser `administrador`, no `usuario-publico`.

### 3. Verificar en la Aplicación

1. Después del registro exitoso, verificar que el usuario tenga los permisos correctos
2. Si hay componentes que muestran el rol, verificar que se muestre "Administrador"

## Debugging

### Logs en la Consola del Navegador

- `Registrando usuario con rol: [rol]`
- `Resultado del registro: [datos]`
- `Profile loaded from database: [perfil]`

### Logs en Supabase (Logs & Analytics)

- `Usuario creado: ID=..., Username=..., Role=..., Email=...`
- `Error al crear perfil para usuario ...` (si hay errores)

### Consultas SQL para Debugging

```sql
-- Ver todos los usuarios y sus roles
SELECT 
    u.email,
    u.raw_user_meta_data->>'username' as metadata_username,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.username,
    p.role as profile_role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Ver usuarios con roles incorrectos
SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as intended_role,
    p.role as actual_role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.raw_user_meta_data->>'role' != p.role;
```

## Corrección de Usuarios Existentes

Si hay usuarios existentes con roles incorrectos, ejecutar:

```sql
-- Esto ya está incluido en fix-role-trigger.sql
SELECT public.fix_existing_profiles();
```

## Validación Final

### Checklist de Verificación

- [ ] El trigger `handle_new_user()` está actualizado
- [ ] Los nuevos registros capturan el rol correctamente
- [ ] Los usuarios existentes con roles incorrectos han sido corregidos
- [ ] La aplicación muestra el rol correcto en la interfaz
- [ ] Los permisos basados en roles funcionan correctamente

### Casos de Prueba

1. **Registro como Administrador**: ✅ Debe crear perfil con rol `administrador`
2. **Registro como Usuario Privado**: ✅ Debe crear perfil con rol `usuario-privado`
3. **Registro como Usuario Público**: ✅ Debe crear perfil con rol `usuario-publico`
4. **Registro sin seleccionar rol**: ✅ Debe usar `usuario-publico` por defecto
5. **Registro con rol inválido**: ✅ Debe usar `usuario-publico` por defecto

## Notas Adicionales

- Los logs de debugging pueden ser removidos en producción
- El trigger maneja errores graciosamente, creando perfiles con valores por defecto si hay problemas
- La función `fix_existing_profiles()` es temporal y puede ser eliminada después de la corrección

## Contacto

Si encuentras problemas adicionales, revisa:
1. Los logs de Supabase
2. La consola del navegador
3. Las consultas SQL de debugging proporcionadas
