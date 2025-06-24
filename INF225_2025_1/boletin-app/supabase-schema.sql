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
    conceptos JSONB DEFAULT NULL,
    links_busqueda JSONB DEFAULT NULL,
    plazo VARCHAR(10) NOT NULL,
    comentarios VARCHAR(200) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'En Revision',
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resultados_api JSONB DEFAULT NULL,
    
    -- Constraints
    CONSTRAINT chk_estado CHECK (estado IN ('En Revision', 'Rechazado', 'Aprobado', 'Completado')),
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
INSERT INTO boletines (titulo, temas, conceptos, links_busqueda, plazo, comentarios, estado, fecha_registro) VALUES
('Tendencias en Inteligencia Artificial 2024', 
 '["IA", "Machine Learning", "Tecnología"]'::jsonb,
 '["GPT-4", "Redes Neuronales", "Deep Learning", "Automatización"]'::jsonb,
 '["https://arxiv.org/search/?query=artificial+intelligence", "https://scholar.google.com/scholar?q=machine+learning+2024", "https://www.nature.com/search?q=AI+trends"]'::jsonb,
 '3_meses', 
 'Enfocarse en las últimas tendencias y avances en inteligencia artificial', 
 'Aprobado', 
 '2024-01-15T00:00:00Z'),
 
('Sostenibilidad y Energías Renovables', 
 '["Sostenibilidad", "Energía", "Medio Ambiente"]'::jsonb,
 '["Solar", "Eólica", "Hidrógeno Verde", "Carbono Neutral"]'::jsonb,
 '["https://www.sciencedirect.com/search?qs=renewable+energy", "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=sustainability", "https://www.mdpi.com/search?q=green+energy"]'::jsonb,
 '6_meses', 
 'Investigar avances en tecnologías de energía limpia y sostenible', 
 'En Revision', 
 '2024-02-10T00:00:00Z'),
 
('Blockchain y Criptomonedas', 
 '["Blockchain", "Fintech", "Criptomonedas"]'::jsonb,
 '["Bitcoin", "Ethereum", "DeFi", "NFT", "Smart Contracts"]'::jsonb,
 '["https://coindesk.com/search?q=blockchain+technology", "https://cointelegraph.com/search?query=cryptocurrency", "https://ethereum.org/en/developers/docs/"]'::jsonb,
 '1_año', 
 'Analizar el impacto de blockchain en el sector financiero', 
 'Rechazado', 
 '2024-03-05T00:00:00Z'),

('Mejores prácticas para el cultivo en condiciones de sequía', 
 '["sequía", "cultivo", "agricultura sostenible"]'::jsonb,
 '["Drought conditions", "Water scarcity", "Dry farming", "Drought-resistant crops", "Water conservation", "Drip irrigation", "Micro-irrigation", "Mulching techniques", "Soil moisture retention", "Xerophytic plants", "Deficit irrigation", "Rainwater harvesting"]'::jsonb,
 '["https://www.fao.org/drought/en/", "https://scholar.google.com/scholar?q=drought+resistant+crops", "https://www.nature.com/subjects/agricultural-sustainability", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/drought-stress", "https://www.usda.gov/topics/disaster-resource-center/drought", "https://www.cgiar.org/research/program-platform/water-land-and-ecosystems/"]'::jsonb,
 '1_año', 
 'Enfocarse en técnicas de conservación de agua y cultivos resistentes a la sequía', 
 'Completado', 
 '2025-04-15T00:00:00Z'),
 
('Control de plagas en campos de trigo', 
 '["plagas", "trigo", "control biológico"]'::jsonb,
 '["Integrated Pest Management", "Biological control", "Natural predators", "Beneficial insects", "Crop rotation", "Resistant varieties", "Pheromone traps", "Organic pesticides", "Fungal diseases", "Insect pests", "Weed management", "Sustainable agriculture"]'::jsonb,
 '["https://www.cabi.org/isc/", "https://scholar.google.com/scholar?q=biological+pest+control", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/pest-control", "https://www.fao.org/pest-and-pesticide-management/en/", "https://ipm.ucanr.edu/", "https://www.epa.gov/pesticide-science-and-assessing-pesticide-risks/integrated-pest-management-ipm-principles"]'::jsonb,
 '6_meses', 
 'Investigar métodos de control biológico y su efectividad en comparación con pesticidas', 
 'Completado', 
 '2025-04-10T00:00:00Z');

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
