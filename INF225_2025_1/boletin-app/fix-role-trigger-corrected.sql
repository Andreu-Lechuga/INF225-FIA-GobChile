-- ============================================================================
-- CORRECCIÓN DEL TRIGGER PARA ROLES - SIN FALLBACK
-- ============================================================================
-- Este script corrige el trigger para que use exactamente el rol seleccionado
-- ============================================================================

-- 1. ELIMINAR FUNCIÓN EXISTENTE
-- ============================================================================
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 2. FUNCIÓN CORREGIDA - SIN FALLBACK DE ROL
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_username TEXT;
    user_role TEXT;
    base_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Log para debugging - ver qué metadatos llegan
    RAISE LOG 'Metadatos recibidos para usuario %: %', NEW.id, NEW.raw_user_meta_data;
    
    -- Extraer username de metadata o usar email como base
    base_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1),
        'user'
    );
    
    -- Limpiar username (solo letras, números y guiones)
    base_username := regexp_replace(base_username, '[^a-zA-Z0-9_-]', '', 'g');
    
    -- Asegurar que no esté vacío
    IF base_username = '' OR base_username IS NULL THEN
        base_username := 'user';
    END IF;
    
    -- Encontrar un username único
    user_username := base_username;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = user_username) LOOP
        counter := counter + 1;
        user_username := base_username || '_' || counter::text;
    END LOOP;
    
    -- CAMBIO PRINCIPAL: Extraer rol SIN fallback
    user_role := NEW.raw_user_meta_data->>'role';
    
    -- Log del rol extraído
    RAISE LOG 'Rol extraído de metadatos: %', user_role;
    
    -- Validar que el rol esté presente
    IF user_role IS NULL OR user_role = '' THEN
        RAISE EXCEPTION 'Rol no proporcionado en metadatos del usuario. Metadatos: %', NEW.raw_user_meta_data;
    END IF;
    
    -- Validar que el rol sea válido
    IF user_role NOT IN ('administrador', 'usuario-privado', 'usuario-publico') THEN
        RAISE EXCEPTION 'Rol inválido: %. Roles válidos: administrador, usuario-privado, usuario-publico', user_role;
    END IF;
    
    -- Log antes de insertar
    RAISE LOG 'Creando perfil: ID=%, Username=%, Role=%', NEW.id, user_username, user_role;
    
    -- Insertar perfil con el rol exacto
    INSERT INTO profiles (id, username, role)
    VALUES (NEW.id, user_username, user_role);
    
    -- Log de éxito
    RAISE LOG 'Perfil creado exitosamente para usuario %', NEW.id;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error y re-lanzar
        RAISE LOG 'Error creando perfil para usuario %: %', NEW.id, SQLERRM;
        RAISE EXCEPTION 'Error al crear perfil: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RECREAR TRIGGER
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. ELIMINAR DEFAULT DE LA TABLA (OPCIONAL)
-- ============================================================================
-- Remover el default 'usuario-publico' de la columna role
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- 5. VERIFICACIÓN
-- ============================================================================
SELECT 
    'Trigger corregido exitosamente. ' ||
    'Ahora usará exactamente el rol seleccionado sin fallback.' as status;
