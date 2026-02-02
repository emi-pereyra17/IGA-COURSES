-- =====================================================
-- Script para actualizar las imágenes de los cursos
-- Proyecto: IGA Courses
-- Fecha: 2026-01-30
-- =====================================================

USE iga_courses;

-- Actualizar imagen del curso de Cocina Italiana
UPDATE courses 
SET image_url = '/italia.jpg'
WHERE name = 'Cocina Italiana Profesional';

-- Actualizar imagen del curso de Repostería Francesa
UPDATE courses 
SET image_url = '/francia.webp'
WHERE name LIKE 'Repostería Francesa%';

-- Actualizar imagen del curso de Cocina Peruana
UPDATE courses 
SET image_url = '/peru.avif'
WHERE name LIKE 'Cocina Peruana%';

-- Verificar los cambios
SELECT id, name, image_url FROM courses ORDER BY id;
