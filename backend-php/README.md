# Backend PHP - API Admin (CodeIgniter 4)

API de reportes administrativos para IGA Courses.

## 🚀 Instalación

```bash
composer install
php spark serve --port=8080
```

## 📋 Configuración

El archivo `.env` ya está configurado para XAMPP:

```env
DB_HOST = localhost
DB_USERNAME = root
DB_PASSWORD = 
DB_DATABASE = iga_courses
```

## 🔌 Endpoint

```
GET /api/reportes/ventas  → Reporte de ventas con JOIN de cursos
```

## 📦 Requisitos

- PHP 8.1+ con extensión `intl` habilitada
- Composer
- MySQL corriendo (XAMPP o standalone)

## 🌐 Puerto

`http://localhost:8080`
