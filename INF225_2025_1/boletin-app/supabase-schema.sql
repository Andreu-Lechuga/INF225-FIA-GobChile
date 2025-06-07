-- Esquema de base de datos para Supabase
-- Este archivo contiene las tablas y configuraciones necesarias para migrar de MySQL a Supabase

-- Crear tabla profiles para usuarios (complementa auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'usuario-publico',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints para roles válidos
    CONSTRAINT chk_role CHECK (role IN ('administrador', 'usuario-privado', 'usuario-publico'))
);

-- Habilitar Row Level Security (RLS) para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para la tabla profiles
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Los administradores pueden ver todos los perfiles
CREATE POLICY "Los administradores pueden ver todos los perfiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'administrador'
        )
    );

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
        COALESCE(new.raw_user_meta_data->>'role', 'usuario-publico')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Crear tabla boletines
CREATE TABLE IF NOT EXISTS boletines (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    temas JSONB NOT NULL,
    plazo VARCHAR(10) NOT NULL,
    comentarios VARCHAR(200) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Registrado',
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resultados_api JSONB DEFAULT NULL,
    
    -- Constraints
    CONSTRAINT chk_estado CHECK (estado IN ('Registrado', 'En proceso', 'Completado')),
    CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE boletines ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para la tabla boletines
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden leer boletines" ON boletines
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir inserción a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden crear boletines" ON boletines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar boletines" ON boletines
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir eliminación a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar boletines" ON boletines
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insertar datos de ejemplo
INSERT INTO boletines (titulo, temas, plazo, comentarios, estado, fecha_registro) VALUES
('Mejores prácticas para el cultivo en condiciones de sequía', 
 '["sequía", "cultivo", "agricultura sostenible"]'::jsonb, 
 '1_año', 
 'Enfocarse en técnicas de conservación de agua y cultivos resistentes a la sequía', 
 'Completado', 
 '2025-04-15T00:00:00Z'),
 
('Control de plagas en campos de trigo', 
 '["plagas", "trigo", "control biológico"]'::jsonb, 
 '6_meses', 
 'Investigar métodos de control biológico y su efectividad en comparación con pesticidas', 
 'Completado', 
 '2025-04-10T00:00:00Z'),
 
('Estrategias de riego en tiempos de escasez hídrica', 
 '["riego", "escasez hídrica", "optimización"]'::jsonb, 
 '3_meses', 
 'Analizar sistemas de riego por goteo y otras tecnologías de ahorro de agua', 
 'Completado', 
 '2025-04-05T00:00:00Z'),
 
('Innovaciones en el manejo de cultivos resistentes a plagas', 
 '["innovación", "resistencia", "cultivos"]'::jsonb, 
 '1_año', 
 'Estudiar avances en modificación genética para resistencia a plagas', 
 'En proceso', 
 '2025-04-01T00:00:00Z'),
 
('Impacto del cambio climático en la agricultura a largo plazo', 
 '["cambio climático", "agricultura", "proyección"]'::jsonb, 
 '2_años', 
 'Evaluar proyecciones climáticas y su impacto en diferentes tipos de cultivos', 
 'Registrado', 
 '2025-03-25T00:00:00Z');

-- Ejemplo de cómo actualizar resultados_api
/*
UPDATE boletines 
SET resultados_api = '[
  ["Nuevas técnicas de cultivo en condiciones de sequía", 
   "Investigadores desarrollan métodos innovadores para optimizar el uso del agua en cultivos de secano", 
   "https://ejemplo.com/articulo1"],
  ["Estudio revela efectividad de cultivos resistentes a la sequía", 
   "Un estudio de 5 años muestra que las variedades modificadas pueden aumentar el rendimiento hasta un 40% en condiciones de escasez hídrica", 
   "https://ejemplo.com/articulo2"],
  ["Sistemas de riego por goteo reducen consumo de agua en un 60%", 
   "Agricultores de la región central reportan importantes ahorros tras implementar tecnologías de riego eficiente", 
   "https://ejemplo.com/articulo3"]
]'::jsonb
WHERE id = 1;
*/