-- =====================================================
-- Script de inicialización de base de datos
-- Proyecto: IGA Courses
-- Fecha: 2026-01-28
-- =====================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS iga_courses;
USE iga_courses;

-- =====================================================
-- Tabla: courses
-- Descripción: Almacena los cursos disponibles
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    detail TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: clients
-- Descripción: Almacena los datos de clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: purchases
-- Descripción: Almacena las compras realizadas
-- =====================================================
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    client_id INT NOT NULL,
    purchase_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_client_id (client_id),
    INDEX idx_purchase_date (purchase_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabla: users
-- Descripción: Almacena los usuarios del sistema con autenticación
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Hash de la contraseña',
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos de prueba: Cursos de Gastronomía
-- =====================================================
INSERT INTO courses (name, description, price, detail, image_url) VALUES
(
    'Cocina Italiana Profesional',
    'Aprende las técnicas fundamentales de la cocina italiana, desde pastas frescas hasta risottos perfectos.',
    299.99,
    'Este curso incluye: Preparación de pastas frescas (tagliatelle, ravioli, gnocchi), técnicas de cocción de risotto, salsas clásicas italianas (carbonara, amatriciana, bolognesa), preparación de pizzas artesanales, y postres tradicionales como tiramisú y panna cotta. Incluye recetario digital y certificado de finalización.',
    '/italia.jpg'
),
(
    'Repostería Francesa: Del Croissant al Macaron',
    'Domina las técnicas de la repostería francesa con un enfoque profesional y detallado.',
    349.99,
    'Curso intensivo que cubre: Técnicas de hojaldre y preparación de croissants, macarons franceses paso a paso, éclairs y profiteroles, tartas clásicas (tarte tatin, tarte au citron), crema pastelera y ganaches, montaje y decoración profesional. Material incluido: termómetro de cocina, manga pastelera profesional y recetario ilustrado.',
    '/francia.webp'
),
(
    'Cocina Peruana Contemporánea',
    'Explora los sabores de la gastronomía peruana fusionando tradición y técnicas modernas.',
    279.99,
    'Contenido del curso: Ceviches y tiraditos (técnicas de corte y marinado), preparación de causas y anticuchos, arroces peruanos (chaufa, con mariscos), ají de gallina y carapulcra, lomo saltado técnica wok, postres peruanos (suspiro limeño, mazamorra morada, picarones). Incluye kit de ajíes peruanos, recetario digital y acceso a comunidad privada.',
    '/peru.avif'
);

-- =====================================================
-- Datos de prueba: Usuarios del sistema
-- Contraseñas (usar estas credenciales para login):
-- admin@iga.com -> admin123
-- user@iga.com -> user123
-- Nota: Los hashes deben ser generados con bcrypt antes de insertar
-- Para generar nuevos hashes ejecutar: node backend-nest/generate-hashes.js
-- =====================================================
-- NOTA: Los hashes a continuación son placeholders
-- Ejecutar migration-add-users.sql después del init para usuarios reales
-- O ejecutar generate-hashes.js para generar hashes válidos

-- =====================================================
-- Verificación de datos insertados
-- =====================================================
SELECT 'Datos de prueba insertados correctamente' AS status;
SELECT COUNT(*) AS total_courses FROM courses;
SELECT COUNT(*) AS total_users FROM users;
