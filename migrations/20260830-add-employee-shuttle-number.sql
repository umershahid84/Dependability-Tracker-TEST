-- Migration: add shuttle_number column to employees
-- Run with your preferred migration tool. This file is a plain SQL migration for MariaDB/MySQL.
-- Note: the app also applies this column automatically on startup via
-- ensureEmployeeShuttleNumberColumn (src/lib/db/connection/index.ts), so running this
-- file by hand is optional and safe to skip if the app has already started once.

ALTER TABLE `employees`
  ADD COLUMN `shuttle_number` VARCHAR(255) NULL DEFAULT NULL;
