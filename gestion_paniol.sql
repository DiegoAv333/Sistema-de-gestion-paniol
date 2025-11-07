-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2025 a las 12:47:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_paniol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `Id_Docente` int(255) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Id_Taller` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente`
--

INSERT INTO `docente` (`Id_Docente`, `Nombre`, `Apellido`, `Email`, `Id_Taller`) VALUES
(1, 'Juan', 'Pérez', 'a@a.com', 1),
(2, 'María', 'Gómez', 'b@b.com', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
  `Id_Material` int(11) NOT NULL,
  `Nombre_Descripcion` varchar(255) NOT NULL,
  `StockActual` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `material`
--

INSERT INTO `material` (`Id_Material`, `Nombre_Descripcion`, `StockActual`) VALUES
(1, 'Destornillador', 50),
(2, 'Lima', 30),
(3, 'Cable de cobre', 100),
(4, 'Madera de pino', 34);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materialxrotacionxtaller`
--

CREATE TABLE `materialxrotacionxtaller` (
  `Id_Taller` int(255) NOT NULL,
  `Id_Rotacion` int(255) NOT NULL,
  `Id_Material` int(255) NOT NULL,
  `Fecha` date NOT NULL,
  `Faltante` int(255) NOT NULL,
  `Nombre_docente` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `materialxrotacionxtaller`
--
DELIMITER $$
CREATE TRIGGER `Calculo_Faltante` BEFORE INSERT ON `materialxrotacionxtaller` FOR EACH ROW BEGIN 
    
    DECLARE v_stockActual INT; 
    DECLARE v_requerimiento INT;

    SELECT stock_actual INTO v_stockActual FROM material WHERE Id_Material = NEW.Id_Material;

    SELECT requerimiento INTO v_requerimiento FROM rotacion WHERE Id_Rotacion = NEW.Id_Rotacion;

    SET NEW.Faltante = v_stockActual - v_requerimiento; 
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rotacion`
--

CREATE TABLE `rotacion` (
  `Id_Rotacion` int(255) NOT NULL,
  `Inicio` date NOT NULL,
  `Final` date NOT NULL,
  `Requerimiento` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taller`
--

CREATE TABLE `taller` (
  `Id_Taller` int(255) NOT NULL,
  `Denominacion` varchar(255) NOT NULL,
  `Turno` enum('Maniana','Tarde') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `taller`
--

INSERT INTO `taller` (`Id_Taller`, `Denominacion`, `Turno`) VALUES
(1, 'Mecánica', 'Maniana'),
(2, 'Electricidad', 'Tarde');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`Id_Docente`),
  ADD KEY `Taller` (`Id_Taller`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`Id_Material`);

--
-- Indices de la tabla `materialxrotacionxtaller`
--
ALTER TABLE `materialxrotacionxtaller`
  ADD UNIQUE KEY `Id_Taller` (`Id_Taller`,`Id_Rotacion`,`Id_Material`),
  ADD KEY `Id_Material` (`Id_Material`),
  ADD KEY `Id_Rotacion` (`Id_Rotacion`);

--
-- Indices de la tabla `rotacion`
--
ALTER TABLE `rotacion`
  ADD PRIMARY KEY (`Id_Rotacion`);

--
-- Indices de la tabla `taller`
--
ALTER TABLE `taller`
  ADD PRIMARY KEY (`Id_Taller`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `docente`
--
ALTER TABLE `docente`
  MODIFY `Id_Docente` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `Id_Material` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `rotacion`
--
ALTER TABLE `rotacion`
  MODIFY `Id_Rotacion` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `taller`
--
ALTER TABLE `taller`
  MODIFY `Id_Taller` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`Id_Taller`) REFERENCES `taller` (`Id_Taller`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `materialxrotacionxtaller`
--
ALTER TABLE `materialxrotacionxtaller`
  ADD CONSTRAINT `materialxrotacionxtaller_ibfk_1` FOREIGN KEY (`Id_Taller`) REFERENCES `taller` (`Id_Taller`) ON DELETE CASCADE,
  ADD CONSTRAINT `materialxrotacionxtaller_ibfk_2` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`) ON DELETE CASCADE,
  ADD CONSTRAINT `materialxrotacionxtaller_ibfk_3` FOREIGN KEY (`Id_Rotacion`) REFERENCES `rotacion` (`Id_Rotacion`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
