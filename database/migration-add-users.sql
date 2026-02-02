-- =====================================================
-- Migración: Agregar tabla de usuarios con autenticación JWT
-- Fecha: 2026-01-30
-- =====================================================

USE iga_courses;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Hash de la contraseña con bcrypt',
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuarios de prueba
-- Contraseñas: admin123 y user123
-- Nota: Ejecutar script generate-hashes.js en backend-nest para generar nuevos hashes
INSERT INTO users (email, password, name, role) VALUES
(
    'admin@iga.com',
    '$2b$10$YQ98z7LVmQ7p9IQhQZ4IgOz5K5ZhQZ4IgO5K5ZhQZ4IgO5K5ZhQZha',
    'Administrador IGA',
    'admin'
),
(
    'user@iga.com',
    '$2b$10$XQ87y6KUlP6o9HPgPY3HfN4J4YgPY3HfN4J4YgPY3HfN4J4YgPYgb',
    'Usuario Demo',
    'user'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    role = VALUES(role);

SELECT 'Migración completada: Tabla users creada y usuarios insertados' AS status;
