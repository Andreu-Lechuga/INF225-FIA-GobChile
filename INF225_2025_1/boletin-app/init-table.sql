-- Script para crear la tabla boletines en Supabase
-- Ejecutar este script en el SQL Editor de Supabase si la tabla no existe

-- Crear tabla boletines con la estructura correcta
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
    
    -- Constraints para validación
    CONSTRAINT chk_estado CHECK (estado IN ('En Revision', 'Rechazado', 'Aprobado', 'Completado')),
    CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
);

-- Mensaje de confirmación
SELECT 'Tabla boletines creada correctamente' as status;
