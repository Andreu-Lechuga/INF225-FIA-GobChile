-- Script completo para limpiar y recrear la base de datos de boletines
-- Este script elimina todo y crea la estructura desde cero

-- ========================================
-- PASO 1: LIMPIEZA COMPLETA
-- ========================================

-- Eliminar todas las políticas RLS si existen
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar boletines" ON boletines;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar boletines" ON boletines;

-- Eliminar la tabla boletines si existe
DROP TABLE IF EXISTS boletines CASCADE;

-- Mensaje de confirmación de limpieza
SELECT 'Base de datos limpiada completamente' as status;

-- ========================================
-- PASO 2: CREAR TABLA CON ESTRUCTURA CORRECTA
-- ========================================

-- Crear tabla boletines con todas las columnas necesarias
CREATE TABLE boletines (
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
    
    -- Constraints opcionales para validación
    CONSTRAINT chk_estado CHECK (estado IN ('En Revision', 'Rechazado', 'Aprobado', 'Completado')),
    CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
);

-- NO habilitar Row Level Security para permitir acceso público
-- ALTER TABLE boletines ENABLE ROW LEVEL SECURITY; -- COMENTADO INTENCIONALMENTE

-- Mensaje de confirmación de creación
SELECT 'Tabla boletines creada correctamente' as status;

-- ========================================
-- PASO 3: INSERTAR DATOS DE EJEMPLO ACTUALIZADOS
-- ========================================

INSERT INTO boletines (titulo, temas, conceptos, links_busqueda, plazo, comentarios, estado, fecha_registro) VALUES

-- Boletín 1: Agricultura Sostenible
('Agricultura Sostenible 2025', 
 '["Agricultura Sostenible", "Tecnología Agrícola", "Medio Ambiente"]'::jsonb,
 '["Sustainable farming", "Precision agriculture", "Organic farming", "Climate-smart agriculture", "Soil health", "Biodiversity conservation", "Carbon sequestration", "Renewable energy in agriculture", "Water conservation", "Integrated pest management"]'::jsonb,
 '["https://www.fao.org/sustainability/en/", "https://scholar.google.com/scholar?q=sustainable+agriculture+2025", "https://www.nature.com/subjects/agricultural-sustainability", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/sustainable-agriculture", "https://link.springer.com/search?query=sustainable+farming"]'::jsonb,
 '6_meses', 
 'Investigar las últimas tendencias en agricultura sostenible y tecnologías emergentes', 
 'En Revision', 
 NOW() - INTERVAL '2 days'),

-- Boletín 2: Control de Plagas Biológico
('Control Biológico de Plagas en Cultivos', 
 '["Control de Plagas", "Agricultura Orgánica", "Biodiversidad"]'::jsonb,
 '["Biological pest control", "Integrated pest management", "Natural predators", "Beneficial insects", "Biopesticides", "Organic farming", "Sustainable agriculture", "Crop protection", "Ecological balance", "Pest resistance management"]'::jsonb,
 '["https://www.cabi.org/isc/", "https://scholar.google.com/scholar?q=biological+pest+control", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-pest-control", "https://www.nature.com/subjects/pest-management", "https://link.springer.com/search?query=integrated+pest+management"]'::jsonb,
 '1_año', 
 'Analizar métodos de control biológico y su efectividad comparada con pesticidas químicos', 
 'Aprobado', 
 NOW() - INTERVAL '5 days'),

-- Boletín 3: Riego Eficiente
('Sistemas de Riego Eficiente y Conservación', 
 '["Riego", "Conservación de Agua", "Tecnología Agrícola"]'::jsonb,
 '["Drip irrigation", "Precision irrigation", "Water conservation", "Smart irrigation systems", "Soil moisture sensors", "Irrigation scheduling", "Water use efficiency", "Deficit irrigation", "Micro-irrigation", "Automated irrigation"]'::jsonb,
 '["https://www.fao.org/land-water/water/en/", "https://scholar.google.com/scholar?q=precision+irrigation+systems", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/drip-irrigation", "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=smart+irrigation", "https://link.springer.com/search?query=water+conservation+agriculture"]'::jsonb,
 '3_meses', 
 'Evaluar tecnologías de riego eficiente para optimizar el uso del agua en agricultura', 
 'Completado', 
 NOW() - INTERVAL '10 days'),

-- Boletín 4: Cultivos Resistentes al Cambio Climático
('Adaptación de Cultivos al Cambio Climático', 
 '["Cambio Climático", "Genética Vegetal", "Adaptación"]'::jsonb,
 '["Climate change adaptation", "Drought resistant crops", "Heat tolerance", "Climate resilient agriculture", "Crop breeding", "Genetic diversity", "Stress tolerance", "Weather variability", "Agricultural adaptation", "Climate smart varieties"]'::jsonb,
 '["https://www.cgiar.org/research/climate-change/", "https://scholar.google.com/scholar?q=climate+resilient+crops", "https://www.nature.com/subjects/plant-breeding", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/climate-change-adaptation", "https://link.springer.com/search?query=drought+resistant+crops"]'::jsonb,
 '1_año', 
 'Investigar variedades de cultivos adaptadas a condiciones climáticas extremas', 
 'En Revision', 
 NOW() - INTERVAL '1 day'),

-- Boletín 5: Agricultura de Precisión
('Tecnologías de Agricultura de Precisión', 
 '["Agricultura de Precisión", "IoT", "Sensores"]'::jsonb,
 '["Precision agriculture", "IoT sensors", "GPS technology", "Variable rate application", "Yield mapping", "Soil sensors", "Drone technology", "Satellite imagery", "Data analytics", "Smart farming"]'::jsonb,
 '["https://www.precisionag.com/", "https://scholar.google.com/scholar?q=precision+agriculture+technology", "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=precision+farming", "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/precision-agriculture", "https://link.springer.com/search?query=smart+farming+sensors"]'::jsonb,
 '6_meses', 
 'Analizar el impacto de las tecnologías de precisión en la productividad agrícola', 
 'Aprobado', 
 NOW() - INTERVAL '7 days');

-- ========================================
-- PASO 4: VERIFICACIÓN FINAL
-- ========================================

-- Mostrar estructura de la tabla creada
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'boletines' 
ORDER BY ordinal_position;

-- Contar registros insertados
SELECT COUNT(*) as total_boletines FROM boletines;

-- Mostrar algunos ejemplos de los datos insertados
SELECT 
    id,
    titulo,
    array_length(temas::text[]::text[], 1) as num_temas,
    array_length(conceptos::text[]::text[], 1) as num_conceptos,
    plazo,
    estado,
    fecha_registro::date as fecha
FROM boletines 
ORDER BY fecha_registro DESC;

-- Mensaje final
SELECT 'Base de datos recreada exitosamente con datos de ejemplo' as status;
