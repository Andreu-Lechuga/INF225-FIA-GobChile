-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS boletines_db;
USE boletines_db;

-- Crear tabla boletines
CREATE TABLE IF NOT EXISTS boletines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    temas JSON NOT NULL,
    plazo VARCHAR(10) NOT NULL,
    indicaciones VARCHAR(200) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Registrado',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_estado CHECK (estado IN ('Registrado', 'En proceso', 'Completado')),
    CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
);

-- Insertar datos de ejemplo
INSERT INTO boletines (titulo, temas, plazo, indicaciones, estado, fecha_registro) VALUES
('Mejores prácticas para el cultivo en condiciones de sequía', 
 '["sequía", "cultivo", "agricultura sostenible"]', 
 '1_año', 
 'Enfocarse en técnicas de conservación de agua y cultivos resistentes a la sequía', 
 'Completado', 
 '2025-04-15'),
 
('Control de plagas en campos de trigo', 
 '["plagas", "trigo", "control biológico"]', 
 '6_meses', 
 'Investigar métodos de control biológico y su efectividad en comparación con pesticidas', 
 'Completado', 
 '2025-04-10'),
 
('Estrategias de riego en tiempos de escasez hídrica', 
 '["riego", "escasez hídrica", "optimización"]', 
 '3_meses', 
 'Analizar sistemas de riego por goteo y otras tecnologías de ahorro de agua', 
 'Completado', 
 '2025-04-05'),
 
('Innovaciones en el manejo de cultivos resistentes a plagas', 
 '["innovación", "resistencia", "cultivos"]', 
 '1_año', 
 'Estudiar avances en modificación genética para resistencia a plagas', 
 'En proceso', 
 '2025-04-01'),
 
('Impacto del cambio climático en la agricultura a largo plazo', 
 '["cambio climático", "agricultura", "proyección"]', 
 '2_años', 
 'Evaluar proyecciones climáticas y su impacto en diferentes tipos de cultivos', 
 'Registrado', 
 '2025-03-25');
