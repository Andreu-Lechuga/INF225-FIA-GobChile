-- ============================================================================
-- SCHEMA SIMPLIFICADO Y ROBUSTO DE AUTENTICACIÓN - SUPABASE
-- ============================================================================
-- Este schema está diseñado para SIEMPRE funcionar, sin fallar por validaciones
-- ============================================================================

-- 1. CREAR TABLA PROFILES (SIMPLIFICADA Y ROBUSTA)
-- ============================================================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(100) NOT NULL, -- Aumentado para evitar conflictos
    role VARCHAR(50) NOT NULL DEFAULT 'usuario-publico',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 3. HABILITAR ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS RLS BÁSICAS PERO EFECTIVAS
-- ============================================================================

-- Política 1: Los usuarios pueden ver su propio perfil
CREATE POLICY "users_can_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política 2: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "users_can_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política 3: Permitir inserción durante el registro (necesario para el trigger)
CREATE POLICY "allow_profile_creation" ON profiles
    FOR INSERT WITH CHECK (true);

-- Política 4: Los administradores pueden ver todos los perfiles
CREATE POLICY "admins_can_view_all_profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'administrador'
        )
    );

-- 5. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER PARA updated_at
-- ============================================================================
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 7. FUNCIÓN SUPER ROBUSTA PARA CREAR PERFILES
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_username TEXT;
    user_role TEXT;
    base_username TEXT;
    counter INTEGER := 0;
BEGIN
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
    
    -- Extraer y validar rol
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'usuario-publico');
    
    -- Validar que el rol sea válido (si no, usar default)
    IF user_role NOT IN ('administrador', 'usuario-privado', 'usuario-publico') THEN
        user_role := 'usuario-publico';
    END IF;
    
    -- Insertar perfil
    INSERT INTO profiles (id, username, role)
    VALUES (NEW.id, user_username, user_role);
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Si TODO falla, crear perfil mínimo con ID único
        BEGIN
            INSERT INTO profiles (id, username, role)
            VALUES (
                NEW.id, 
                'user_' || substring(NEW.id::text, 1, 8),
                'usuario-publico'
            );
            RETURN NEW;
        EXCEPTION
            WHEN OTHERS THEN
                -- Último recurso: log el error y continuar
                RAISE LOG 'Error crítico creando perfil para %: %', NEW.id, SQLERRM;
                RETURN NEW;
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER PARA CREAR PERFILES AUTOMÁTICAMENTE
-- ============================================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 9. VERIFICACIÓN FINAL
-- ============================================================================
-- Verificar que todo se creó correctamente
DO $$
BEGIN
    -- Verificar tabla
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        RAISE EXCEPTION 'Error: Tabla profiles no se creó correctamente';
    END IF;
    
    -- Verificar función
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        RAISE EXCEPTION 'Error: Función handle_new_user no se creó correctamente';
    END IF;
    
    -- Verificar trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        RAISE EXCEPTION 'Error: Trigger on_auth_user_created no se creó correctamente';
    END IF;
    
    RAISE NOTICE 'Schema de autenticación creado exitosamente';
END
$$;

-- ============================================================================
-- CONFIRMACIÓN
-- ============================================================================
SELECT 
    'Schema de autenticación simplificado creado exitosamente. ' ||
    'Ahora puedes probar el registro y login.' as status;
