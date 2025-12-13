-- Wastemon SQL seed file
-- Import this file in phpMyAdmin to create a local development database with sample data.

-- Drop and recreate database
DROP DATABASE IF EXISTS `wastemon`;
CREATE DATABASE `wastemon` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `wastemon`;

-- Users table (development/testing only)
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `fullname` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `password_md5` CHAR(32) DEFAULT NULL, -- MD5 of password for simple test auth (not secure)
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin test user
INSERT INTO `users` (`username`, `fullname`, `email`, `password_md5`, `role`) VALUES
('admin', 'Admin User', 'admin@example.com', MD5('password123'), 'admin');
-- Metrics table holds snapshot metrics for the dashboard
CREATE TABLE `metrics` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `total_waste` DECIMAL(10,2) DEFAULT 0.00,
  `diversion_pct` INT DEFAULT 0,
  `recycling_pct` INT DEFAULT 0,
  `savings_usd` DECIMAL(12,2) DEFAULT 0.00,
  `avg_fill_pct` INT DEFAULT 0,
  `overflow_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert one sample metrics row (matches values used in JS mock data)
INSERT INTO `metrics` (`total_waste`, `diversion_pct`, `recycling_pct`, `savings_usd`, `avg_fill_pct`, `overflow_count`) VALUES
(25.80, 85, 72, 3450.00, 78, 3);

-- Waste composition breakdown (for charts)
CREATE TABLE `composition` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(100) NOT NULL,
  `value` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `composition` (`label`, `value`) VALUES
('Recyclable', 45),
('General', 30),
('Organic', 25);

-- Bins table (for map markers)
CREATE TABLE `bins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `fill_level_pct` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'ok',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `bins` (`name`, `latitude`, `longitude`, `fill_level_pct`, `status`) VALUES
('Bin 101', 51.505, -0.09, 78, 'ok'),
('Bin 102', 51.51, -0.1, 82, 'ok'),
('Bin 103', 51.499, -0.08, 95, 'overflow');

-- Staff table
CREATE TABLE `staff` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(100) DEFAULT 'staff',
  `route` VARCHAR(100) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'available',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `staff` (`name`, `role`, `route`, `status`) VALUES
('Alex Johnson', 'Collector', 'Route 5 - Downtown', 'on-duty'),
('Maria Garcia', 'Collector', 'Route 2 - Suburbs', 'on-duty'),
('Sam Chen', 'Support', NULL, 'standby');

-- Trucks table (activity log)
CREATE TABLE `trucks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `truck_number` VARCHAR(50) NOT NULL,
  `route` VARCHAR(150) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'idle',
  `last_update` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `trucks` (`truck_number`, `route`, `status`) VALUES
('Truck #001', 'Route 5', 'complete'),
('Truck #002', 'Route 2', 'enroute'),
('Truck #003', NULL, 'maintenance');

-- Simple example view to join metrics and composition if needed
CREATE VIEW `dashboard_snapshot` AS
SELECT m.*, c.label, c.value
FROM metrics m
LEFT JOIN composition c ON 1 = 1;

-- End of seed

