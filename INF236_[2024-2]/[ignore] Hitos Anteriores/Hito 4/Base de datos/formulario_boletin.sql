-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-11-2024 a las 00:10:39
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `formulario_boletin`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boletines`
--

CREATE TABLE `boletines` (
  `id` int(11) NOT NULL,
  `tema` enum('sequía','plagas','cambio_climatico','otro') NOT NULL,
  `otro_tema` varchar(255) DEFAULT NULL,
  `prioridad` enum('alta','media','baja') NOT NULL,
  `plazo` enum('1_mes','3_meses','6_meses') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `estado` varchar(50) DEFAULT 'Registrado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boletines`
--

INSERT INTO `boletines` (`id`, `tema`, `otro_tema`, `prioridad`, `plazo`, `descripcion`, `fecha_registro`, `estado`) VALUES
(6, 'cambio_climatico', NULL, 'media', '3_meses', 'Análisis de los principales efectos del cambio climático en distintas regiones y posibles medidas de mitigación', '2024-11-04 16:42:44', 'Subido'),
(7, 'sequía', NULL, 'alta', '1_mes', 'Impacto de la sequía en los recursos hídricos y estrategias para la gestión sostenible del agua', '2024-11-08 16:44:36', 'Subido'),
(8, 'otro', 'agropecuario', 'media', '3_meses', 'Estudio de prácticas sostenibles para mejorar la productividad del sector agropecuario.', '2024-11-08 16:48:01', 'Registrado'),
(9, 'otro', 'cultivo automatico', 'media', '6_meses', 'Implementación de tecnologías de automatización en cultivos para optimizar el rendimiento agrícola.', '2024-11-08 16:56:22', 'Subido'),
(10, 'otro', 'metodos antiplagas', 'media', '6_meses', 'Evaluación de métodos innovadores y sostenibles para el control de plagas en cultivos.', '2024-11-08 16:57:29', 'Registrado'),
(11, 'plagas', NULL, 'media', '6_meses', '\"Identificación de las plagas más comunes en diferentes regiones y su manejo integral.', '2024-11-08 16:58:11', 'Registrado'),
(12, 'cambio_climatico', NULL, 'baja', '6_meses', 'Como afrontar a cambios climaticos drasticos', '2024-11-08 17:23:23', 'Registrado'),
(13, 'sequía', NULL, 'alta', '1_mes', 'Evaluación de sequías en zonas áridas y estrategias de mitigación.', '2024-11-08 18:00:00', 'Registrado'),
(14, 'sequía', NULL, 'media', '3_meses', 'Impacto de las sequías prolongadas en la agricultura y el suministro de agua.', '2024-11-08 18:01:00', 'Subido'),
(15, 'cambio_climatico', NULL, 'alta', '1_mes', 'Estudio de los cambios en los patrones climáticos y sus implicaciones globales.', '2024-11-08 18:02:00', 'Registrado'),
(16, 'plagas', NULL, 'baja', '6_meses', 'Control de plagas en cultivos de cereales utilizando métodos sostenibles.', '2024-11-08 18:04:00', 'Registrado'),
(17, 'plagas', NULL, 'media', '3_meses', 'Impacto de las plagas en el rendimiento agrícola y posibles soluciones.', '2024-11-08 18:05:00', 'Subido');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `boletines`
--
ALTER TABLE `boletines`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `boletines`
--
ALTER TABLE `boletines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
