-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2025 a las 12:29:37
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
  `Requerimiento` int(255) NOT NULL COMMENT 'Requerimiento específico de este material para esta rotación.',
  `Observacion` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materialxrotacionxtaller`
--

INSERT INTO `materialxrotacionxtaller` (`Id_Taller`, `Id_Rotacion`, `Id_Material`, `Fecha`, `Requerimiento`, `Observacion`) VALUES
(1, 1, 1, '2025-11-07', 20, NULL),
(1, 1, 4, '2025-11-07', 40, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rotacion`
--

CREATE TABLE `rotacion` (
  `Id_Rotacion` int(255) NOT NULL,
  `Inicio` date NOT NULL,
  `Final` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rotacion`
--

INSERT INTO `rotacion` (`Id_Rotacion`, `Inicio`, `Final`) VALUES
(1, '2025-11-01', '2025-12-15');

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

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_dashboard_paniol`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_dashboard_paniol` (
`Id_Material` int(11)
,`Nombre_Descripcion` varchar(255)
,`StockActual` int(255)
,`Requerimiento` int(255)
,`Balance_Numerico` bigint(67)
,`Estado` varchar(10)
,`Id_Taller` int(255)
,`Nombre_Taller` varchar(255)
,`Id_Rotacion` int(255)
,`Fecha_Inicio_Rotacion` date
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_dashboard_paniol`
--
DROP TABLE IF EXISTS `v_dashboard_paniol`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_dashboard_paniol`  AS SELECT `m`.`Id_Material` AS `Id_Material`, `m`.`Nombre_Descripcion` AS `Nombre_Descripcion`, `m`.`StockActual` AS `StockActual`, `mrt`.`Requerimiento` AS `Requerimiento`, `m`.`StockActual`- `mrt`.`Requerimiento` AS `Balance_Numerico`, CASE WHEN `m`.`StockActual` - `mrt`.`Requerimiento` < 0 THEN 'FALTANTE' WHEN `m`.`StockActual` - `mrt`.`Requerimiento` = 0 THEN 'LIMITADO' WHEN `m`.`StockActual` - `mrt`.`Requerimiento` > 0 THEN 'DISPONIBLE' END AS `Estado`, `t`.`Id_Taller` AS `Id_Taller`, `t`.`Denominacion` AS `Nombre_Taller`, `mrt`.`Id_Rotacion` AS `Id_Rotacion`, `r`.`Inicio` AS `Fecha_Inicio_Rotacion` FROM (((`materialxrotacionxtaller` `mrt` join `material` `m` on(`mrt`.`Id_Material` = `m`.`Id_Material`)) join `rotacion` `r` on(`mrt`.`Id_Rotacion` = `r`.`Id_Rotacion`)) join `taller` `t` on(`mrt`.`Id_Taller` = `t`.`Id_Taller`)) ;

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
  MODIFY `Id_Rotacion` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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

--
-- Estructura de tabla para la tabla `movimiento`
--
CREATE TABLE `movimiento` (
  `Id_Movimiento` int(11) NOT NULL,
  `Id_Material` int(11) NOT NULL,
  `Tipo` enum('Ingreso','Egreso','Cambio de Requerimiento') NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `Id_Taller` int(11) DEFAULT NULL,
  `Id_Docente` int(11) DEFAULT NULL,
  `Observacion` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`Id_Movimiento`),
  ADD KEY `Id_Material` (`Id_Material`),
  ADD KEY `Id_Taller` (`Id_Taller`),
  ADD KEY `Id_Docente` (`Id_Docente`);

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `Id_Movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `movimiento_ibfk_1` FOREIGN KEY (`Id_Material`) REFERENCES `material` (`Id_Material`),
  ADD CONSTRAINT `movimiento_ibfk_2` FOREIGN KEY (`Id_Taller`) REFERENCES `taller` (`Id_Taller`),
  ADD CONSTRAINT `movimiento_ibfk_3` FOREIGN KEY (`Id_Docente`) REFERENCES `docente` (`Id_Docente`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
