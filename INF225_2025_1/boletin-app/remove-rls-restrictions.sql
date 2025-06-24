-- Script para eliminar restricciones de Row Level Security (RLS)
-- Este script permite acceso público a las tablas sin autenticación

-- Deshabilitar RLS en la tabla boletines
ALTER TABLE boletines DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes de la tabla boletines
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar boletines" ON boletines;

-- Deshabilitar RLS en la tabla profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes de la tabla profiles
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los administradores pueden ver todos los perfiles" ON profiles;

-- Mensaje de confirmación
SELECT 'RLS deshabilitado y políticas eliminadas correctamente' as status;
