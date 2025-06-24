-- ============================================================================
-- RESET COMPLETO DE AUTENTICACIÓN - SUPABASE
-- ============================================================================
-- Este script limpia completamente el sistema de autenticación
-- ADVERTENCIA: Esto eliminará TODOS los usuarios y perfiles existentes
-- ============================================================================

-- 1. ELIMINAR TRIGGERS Y FUNCIONES EXISTENTES
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- 2. ELIMINAR POLÍTICAS RLS EXISTENTES
-- ============================================================================
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los administradores pueden ver todos los perfiles" ON profiles;

-- 3. ELIMINAR TABLA PROFILES
-- ============================================================================
DROP TABLE IF EXISTS profiles CASCADE;

-- 4. LIMPIAR USUARIOS DE AUTH (ESTO REQUIERE PRIVILEGIOS DE ADMIN)
-- ============================================================================
-- NOTA: Este paso debe hacerse manualmente desde el Dashboard de Supabase
-- Ve a: Authentication → Users → Seleccionar todos → Delete
-- O ejecuta este comando si tienes permisos de service_role:
-- DELETE FROM auth.users;

-- ============================================================================
-- CONFIRMACIÓN
-- ============================================================================
-- Si este script se ejecuta sin errores, la autenticación está completamente limpia
-- Ahora puedes ejecutar simple-auth-schema.sql para recrear todo

SELECT 'Reset de autenticación completado. Ejecuta simple-auth-schema.sql para recrear.' as status;
