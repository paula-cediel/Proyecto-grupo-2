-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 08, 2026 at 08:35 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `letalcosplay`
--

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `nombre`, `apellido`, `telefono`, `direccion`, `correo`) VALUES
(1, 'Ana', 'Pérez', '3008456123', 'Cra 15 # 93-45', 'ana@mail.com'),
(2, 'Luis', 'Gómez', '3114598732', 'Calle 72 # 10-34', 'luis@mail.com'),
(3, 'María', 'Rodríguez', '3207789456', 'Cra 7 # 26-20', 'maria@mail.com'),
(4, 'Carlos', 'López', '3156642987', 'Calle 127 # 45-18', 'carlos@mail.com'),
(5, 'Sofía', 'Martínez', '3019923478', 'Cra 80 # 42-65', 'sofia@mail.com');

-- --------------------------------------------------------

--
-- Table structure for table `detalle_factura`
--

DROP TABLE IF EXISTS `detalle_factura`;
CREATE TABLE IF NOT EXISTS `detalle_factura` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `cantidad_vendida` int UNSIGNED NOT NULL,
  `precio_unitario` decimal(10,2) UNSIGNED NOT NULL,
  `id_factura` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_factura` (`id_factura`),
  KEY `fk_detalle_producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detalle_factura`
--

INSERT INTO `detalle_factura` (`id_detalle`, `cantidad_vendida`, `precio_unitario`, `id_factura`, `id_producto`) VALUES
(6, 1, 60000.00, 1, 1),
(7, 1, 100000.00, 2, 2),
(8, 1, 80000.00, 3, 3),
(9, 2, 25000.00, 4, 4),
(10, 1, 50000.00, 5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
CREATE TABLE IF NOT EXISTS `factura` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `valor_envio` decimal(10,2) UNSIGNED NOT NULL,
  `id_cliente` int NOT NULL,
  `id_vendedor` int NOT NULL,
  PRIMARY KEY (`id_factura`),
  KEY `fk_factura_cliente` (`id_cliente`),
  KEY `fk_factura_vendedor` (`id_vendedor`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `factura`
--

INSERT INTO `factura` (`id_factura`, `fecha`, `valor_envio`, `id_cliente`, `id_vendedor`) VALUES
(1, '2026-01-02', 8800.00, 1, 1),
(2, '2026-01-03', 8800.00, 2, 1),
(3, '2026-01-04', 8800.00, 3, 1),
(4, '2026-01-05', 8800.00, 4, 1),
(5, '2026-01-06', 8800.00, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
CREATE TABLE IF NOT EXISTS `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio_compra` decimal(10,2) UNSIGNED NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `fk_producto_proveedor` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `precio_compra`, `stock`, `id_proveedor`) VALUES
(1, 'Peluca Naruto', 25000.00, 12, 1),
(2, 'Capa Akatsuki', 55000.00, 7, 2),
(3, 'Katana Decorativa', 35000.00, 4, 3),
(4, 'Lentes Sharingan', 10000.00, 18, 4),
(5, 'Máscara Demon Slayer', 25000.00, 10, 5);

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
CREATE TABLE IF NOT EXISTS `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nit` (`nit`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre`, `nit`) VALUES
(1, 'Anime Factory', '811234987'),
(2, 'Cosplay World', '822987654'),
(3, 'Otaku Market', '833456789'),
(4, 'Fantasy Props', '844321987'),
(5, 'Geek Supplies', '855678321');

-- --------------------------------------------------------

--
-- Table structure for table `vendedor`
--

DROP TABLE IF EXISTS `vendedor`;
CREATE TABLE IF NOT EXISTS `vendedor` (
  `id_vendedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_vendedor`),
  UNIQUE KEY `nit` (`nit`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendedor`
--

INSERT INTO `vendedor` (`id_vendedor`, `nombre`, `nit`, `telefono`, `direccion`, `correo`) VALUES
(1, 'Letal Cosplay', '900789654', '3144426537', 'Calle 163#54-15', 'cosplayletal@gmail.com');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `fk_detalle_factura` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_factura`),
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Constraints for table `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `fk_factura_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `fk_factura_vendedor` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedor` (`id_vendedor`);

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
