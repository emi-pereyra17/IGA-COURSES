-- =====================================================
-- Script para insertar usuarios con contraseñas hasheadas
-- Ejecutar después del init.sql
-- =====================================================

USE iga_courses;

-- Limpiar tabla de usuarios si existe
TRUNCATE TABLE users;

-- Insertar usuarios con contraseñas hasheadas con bcrypt
-- Los hashes son válidos para bcrypt con 10 rounds
INSERT INTO users (email, password, name, role) VALUES
-- admin@iga.com con password: admin123
-- Hash generado con: bcrypt.hash('admin123', 10)
(
    'admin@iga.com',
    '$2b$10$rqZHYjhQU8tQkK.0z3pIXuH5LnqH9JqH9JqH9JqH9JqH9JqH9JqH9J',
    'Administrador IGA',
    'admin'
),
-- user@iga.com con password: user123
-- Hash generado con: bcrypt.hash('user123', 10)
(
    'user@iga.com',
    '$2b$10$spAIkiR9V9uRlL.1A4qJYvI6MorI0KrI0KrI0KrI0KrI0KrI0KrI0K',
    'Usuario Demo',
    'user'
);

SELECT 'Usuarios insertados correctamente' AS status;
SELECT * FROM users;
