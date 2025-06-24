-- Script para corregir el problema del rol en el registro de usuarios
-- Este script actualiza el trigger para que capture correctamente el rol seleccionado

-- Función corregida para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role TEXT;
    user_username TEXT;
BEGIN
    -- Extraer el rol de los metadatos del usuario con mejor manejo de errores
    user_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        'usuario-publico'
    );
    
    -- Validar que el rol sea uno de los permitidos
    IF user_role NOT IN ('administrador', 'usuario-privado', 'usuario-publico') THEN
        user_role := 'usuario-publico';
    END IF;
    
    -- Extraer el username de los metadatos o usar el email como fallback
    user_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
    );
    
    -- Insertar el perfil con los datos extraídos
    INSERT INTO public.profiles (id, username, role)
    VALUES (
        NEW.id, 
        user_username,
        user_role
    );
    
    -- Log para debugging (opcional, se puede remover en producción)
    RAISE LOG 'Usuario creado: ID=%, Username=%, Role=%, Email=%', 
        NEW.id, user_username, user_role, NEW.email;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, crear perfil con valores por defecto
        RAISE LOG 'Error al crear perfil para usuario %: %. Usando valores por defecto.', 
            NEW.id, SQLERRM;
        
        INSERT INTO public.profiles (id, username, role)
        VALUES (
            NEW.id, 
            COALESCE(split_part(NEW.email, '@', 1), 'usuario_' || NEW.id::text),
            'usuario-publico'
        );
        
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger para asegurar que use la función actualizada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función adicional para verificar y corregir perfiles existentes con roles incorrectos
CREATE OR REPLACE FUNCTION public.fix_existing_profiles()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    correct_role TEXT;
BEGIN
    -- Iterar sobre todos los perfiles que podrían tener roles incorrectos
    FOR profile_record IN 
        SELECT p.id, p.username, p.role, u.raw_user_meta_data
        FROM profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE p.role = 'usuario-publico' 
        AND u.raw_user_meta_data->>'role' IS NOT NULL
        AND u.raw_user_meta_data->>'role' != 'usuario-publico'
    LOOP
        -- Extraer el rol correcto de los metadatos
        correct_role := profile_record.raw_user_meta_data->>'role';
        
        -- Validar que el rol sea permitido
        IF correct_role IN ('administrador', 'usuario-privado', 'usuario-publico') THEN
            -- Actualizar el perfil con el rol correcto
            UPDATE profiles 
            SET role = correct_role, updated_at = NOW()
            WHERE id = profile_record.id;
            
            RAISE LOG 'Perfil corregido: Usuario % cambió de % a %', 
                profile_record.username, profile_record.role, correct_role;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función para corregir perfiles existentes
SELECT public.fix_existing_profiles();

-- Limpiar la función temporal (opcional)
-- DROP FUNCTION IF EXISTS public.fix_existing_profiles();
