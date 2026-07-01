-- Migration: create password_reset_codes table
-- Run with your preferred migration tool. This file is a plain SQL migration for MariaDB/MySQL.

CREATE TABLE IF NOT EXISTS `password_reset_codes` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `supervisor_id` VARCHAR(36) NULL,
  `email` VARCHAR(255) NOT NULL,
  `code_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_password_reset_codes_supervisor` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
