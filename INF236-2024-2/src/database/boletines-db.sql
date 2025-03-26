-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS boletines_db;
USE boletines_db;

-- Crear tabla boletines
CREATE TABLE boletines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    plazo INT NOT NULL,
    estado VARCHAR(30) DEFAULT 'Registrado',
    descripcion_extra VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_titulo_length CHECK (LENGTH(titulo) <= 50),
    CONSTRAINT chk_estado_length CHECK (LENGTH(estado) <= 30),
    CONSTRAINT chk_desc_length CHECK (LENGTH(descripcion_extra) <= 200)
);