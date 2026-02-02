# 🍳 IGA Courses - Sistema de Gestión de Cursos de Gastronomía

Sistema completo de gestión de cursos gastronómicos con arquitectura de microservicios.

---

## 📐 Arquitectura del Sistema

El proyecto implementa una arquitectura híbrida que combina tecnologías modernas y legacy:

```
┌────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                      │
│              Puerto: 5173 (Vite Dev)                   │
│                                                        │
│  • Home: Catálogo de cursos                           │
│  • Modal de compra                                     │
│  • Mis Cursos: Historial de compras                   │
│  • Admin Dashboard: Reportes                          │
└──────────────┬────────────────────┬────────────────────┘
               │                    │
               │ REST API           │ REST API
               │ Axios              │ Axios
               │                    │
    ┌──────────▼────────┐  ┌────────▼──────────┐
    │   NestJS API      │  │   PHP API         │
    │  (Moderno)        │  │ (Legacy/Reportes) │
    │  Puerto: 3000     │  │  Puerto: 8080     │
    │                   │  │                   │
    │  • Cursos         │  │  • Reporte de     │
    │  • Compras        │  │    ventas         │
    │  • TypeORM        │  │  • CodeIgniter 4  │
    └────────┬──────────┘  └────────┬──────────┘
             │                      │
             │   MySQL Driver       │ MySQLi
             │   (TypeORM)          │
             │                      │
             └──────────┬───────────┘
                        │
               ┌────────▼─────────┐
               │   MySQL 8.0      │
               │   Puerto: 3306   │
               │                  │
               │ • Base de datos  │
               │   centralizada   │
               └──────────────────┘
```

## ⚡ Inicio Rápido con Scripts

### Opción Automática (Más Fácil) ⭐

**Windows:**

```bash
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

**El script te preguntará:**

- **Opción 1**: Docker (Todo automatizado)
- **Opción 2**: Local (Abre 3 terminales automáticamente)

---

## 🚀 Opción 1: Ejecutar con Docker (Recomendado)

**La forma más rápida y sin configuración manual.**

### Pre-requisitos

- Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- Puertos disponibles: 3000, 3306, 5173, 8080

### Pasos

**1. Iniciar todos los servicios:**

```bash
docker-compose up --build
```

Esto iniciará automáticamente:

- ✅ MySQL 8.0 con el schema inicial
- ✅ API NestJS en http://localhost:3000
- ✅ API PHP en http://localhost:8080
- ✅ Frontend React en http://localhost:5173

**2. Verificar que todo está corriendo:**

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

**3. Acceder a la aplicación:**

Abrir navegador en: **http://localhost:5173**

**4. Detener los servicios:**

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Limpieza completa (incluye volúmenes)
docker-compose down -v
```

### Comandos Útiles

```bash
# Reiniciar un servicio específico
docker-compose restart api-nest
docker-compose restart api-php
docker-compose restart frontend

# Ver logs de un servicio específico
docker-compose logs api-nest
docker-compose logs -f api-php  # Seguir logs en tiempo real

# Acceder al contenedor MySQL
docker exec -it iga-courses-db mysql -uiga_user -piga_password iga_courses

# Backup de la base de datos
docker exec iga-courses-db mysqldump -uiga_user -piga_password iga_courses > backup.sql

# Restaurar backup
docker exec -i iga-courses-db mysql -uiga_user -piga_password iga_courses < backup.sql
```

---

## 💻 Opción 2: Ejecutar Localmente (Desarrollo)

**Para desarrollo local sin Docker se requieren 3 terminales simultáneas.**

### Pre-requisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- PHP 8.3 + Composer ([Descargar](https://www.php.net/))
- MySQL 8.0 ([Descargar](https://dev.mysql.com/downloads/mysql/))

---

### Terminal 1: Base de Datos

**1. Iniciar MySQL:**

```bash
# Windows (como servicio)
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
# o
mysql.server start
```

**2. Crear base de datos e importar schema:**

```bash
# Conectarse a MySQL
mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE iga_courses;
exit;

# Importar el schema inicial
mysql -u root -p iga_courses < database/init.sql
```

**3. Verificar que se creó correctamente:**

```bash
mysql -u root -p iga_courses

# Dentro de MySQL:
SHOW TABLES;
SELECT * FROM cursos;
exit;
```

---

### Terminal 2: Backend NestJS

**1. Instalar dependencias:**

```bash
cd backend-nest
npm install
```

**2. Configurar variables de entorno:**

```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de MySQL:
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=iga_courses
PORT=3000
```

**3. Iniciar servidor:**

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

**4. Verificar que funciona:**

```bash
# En otra terminal:
curl http://localhost:3000/api/courses
```

El servidor debe estar corriendo en **http://localhost:3000**

---

### Terminal 3: Backend PHP (CodeIgniter)

**1. Instalar dependencias:**

```bash
cd backend-php
composer install
```

**2. Configurar base de datos:**

Editar `app/Config/Database.php`:

```php
public array $default = [
    'hostname' => 'localhost',
    'username' => 'root',
    'password' => 'tu_password',
    'database' => 'iga_courses',
    'DBDriver' => 'MySQLi',
    'port'     => 3306,
];
```

**3. Iniciar servidor:**

```bash
php spark serve --port=8080
```

**4. Verificar que funciona:**

```bash
# En otra terminal:
curl http://localhost:8080/api/reportes/ventas
```

El servidor debe estar corriendo en **http://localhost:8080**

---

### Terminal 4: Frontend React

**1. Instalar dependencias:**

```bash
cd frontend
npm install
```

**2. Configurar variables de entorno:**

```bash
# Crear archivo .env
cp .env.example .env

# Contenido del .env:
VITE_API_NEST=http://localhost:3000/api
VITE_API_PHP=http://localhost:8080
```

**3. Iniciar servidor:**

```bash
npm run dev
```

**4. Acceder a la aplicación:**

Abrir navegador en: **http://localhost:5173**

La aplicación debe estar completamente funcional.

---

### Resumen de Terminales

| Terminal | Servicio | Puerto | Comando                                         |
| -------- | -------- | ------ | ----------------------------------------------- |
| **1**    | MySQL    | 3306   | `mysql.server start`                            |
| **2**    | NestJS   | 3000   | `cd backend-nest && npm run start:dev`          |
| **3**    | PHP      | 8080   | `cd backend-php && php spark serve --port=8080` |
| **4**    | Frontend | 5173   | `cd frontend && npm run dev`                    |

**Nota:** Todas las terminales deben estar corriendo simultáneamente para que el sistema funcione.

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** - Librería UI moderna
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Framework de estilos utility-first
- **React Router DOM** - Enrutamiento SPA
- **Axios** - Cliente HTTP

### Backend Moderno (NestJS)

- **NestJS** - Framework progresivo de Node.js
- **TypeScript** - JavaScript con tipos estáticos
- **TypeORM** - ORM para TypeScript/JavaScript
- **Class Validator** - Validación de DTOs
- **MySQL Driver** - Conexión a base de datos

### Backend Legacy (PHP)

- **PHP 8.x** - Lenguaje de programación
- **CodeIgniter 4** - Framework PHP modular
- **MySQLi** - Driver nativo de MySQL

### Base de Datos

- **MySQL 8.0** - Sistema de gestión de bases de datos

### DevOps

- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios

---

## 📁 Estructura del Proyecto

```
IGA-COURSES/
│
├── 📂 backend-nest/          # API NestJS (Cursos y Compras)
│   ├── src/
│   │   ├── courses/          # Módulo de cursos
│   │   ├── purchases/        # Módulo de compras
│   │   └── database/         # Configuración TypeORM
│   ├── Dockerfile
│   └── package.json
│
├── 📂 backend-php/           # API PHP (Reportes Admin)
│   ├── app/
│   │   ├── Controllers/
│   │   │   └── ReporteController.php
│   │   └── Models/
│   │       └── ReporteModel.php
│   ├── Dockerfile
│   └── composer.json
│
├── 📂 frontend/              # Frontend React
│   ├── components/
│   │   └── PurchaseModal.jsx
│   ├── pages/
│   │   ├── Home.jsx          # Catálogo de cursos
│   │   ├── MyCourses.jsx     # Historial de compras
│   │   ├── Admin.jsx         # Dashboard admin
│   │   └── Layout.jsx        # Layout principal
│   ├── api.js                # Config de Axios
│   ├── Dockerfile
│   └── package.json
│
├── 📂 database/              # Scripts de base de datos
│   └── init.sql              # Schema inicial con datos
│
├── 📄 docker-compose.yml     # Orquestación Docker
├── 📄 .env.docker.example    # Template de variables
├── 📄 Makefile               # Comandos simplificados
└── 📄 README.md              # Este archivo
```

---

## 🔌 Endpoints de las APIs

### NestJS API (Puerto 3000)

```
GET    /api/courses                     # Lista todos los cursos
POST   /api/compras                     # Registra una compra
       Body: {nombre, email, celular, cursoId}
GET    /api/compras/historial/:email   # Historial de compras por email
```

### PHP API (Puerto 8080)

```
GET    /api/reportes/ventas             # Reporte completo de ventas
       Response: Array de ventas con JOIN de cursos
```

---

## 🧪 Testing

### Test Manual del Sistema

**1. Home - Catálogo de Cursos:**

- Ir a http://localhost:5173
- Verificar que se cargan los cursos
- Hacer clic en "Comprar"

**2. Modal de Compra:**

- Llenar formulario: Nombre, Email, Celular
- Clic en "Confirmar Compra"
- Verificar mensaje de éxito

**3. Mis Cursos:**

- Ir a "Mis Cursos" en el menú
- Ingresar el email usado en la compra
- Clic en "Buscar Cursos"
- Verificar que aparece la compra

**4. Admin Dashboard:**

- Ir a "Admin" en el menú
- Verificar estadísticas (Total Ventas, Ingresos, Cursos)
- Verificar tabla de ventas completa

### Test de APIs con cURL

```bash
# NestJS - Obtener cursos
curl http://localhost:3000/api/courses

# NestJS - Crear compra
curl -X POST http://localhost:3000/api/compras \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Test",
    "email": "test@example.com",
    "celular": "+54911234567",
    "cursoId": 1
  }'

# NestJS - Historial
curl http://localhost:3000/api/compras/historial/test@example.com

# PHP - Reporte de ventas
curl http://localhost:8080/api/reportes/ventas
```

---

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Ver qué proceso usa el puerto
# Windows:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -ti:3000

# Cambiar puerto en la configuración o matar el proceso
```

### Error de conexión a MySQL

```bash
# Verificar que MySQL está corriendo
# Windows:
net start | findstr MySQL

# Linux/Mac:
ps aux | grep mysql

# Verificar credenciales en archivos .env
```

### Frontend no se conecta a las APIs

- Verificar que las 3 terminales (NestJS, PHP, Frontend) están corriendo
- Verificar variables de entorno en `frontend/.env`
- Abrir consola del navegador (F12) para ver errores

### Docker no inicia

```bash
# Ver logs de servicios
docker-compose logs

# Reiniciar Docker Desktop
# Limpiar y reconstruir:
docker-compose down -v
docker-compose up --build
```

---

## 📊 Base de Datos

### Schema Simplificado

```sql
-- Tabla de cursos
cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  duration VARCHAR(100),
  level VARCHAR(50),
  instructor VARCHAR(255)
)

-- Tabla de compras
compras (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255),
  email VARCHAR(255),
  celular VARCHAR(50),
  cursoId INT,
  created_at TIMESTAMP,
  FOREIGN KEY (cursoId) REFERENCES cursos(id)
)
```

### Backup y Restore

```bash
# Backup
docker exec iga-courses-db mysqldump -uiga_user -piga_password iga_courses > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i iga-courses-db mysql -uiga_user -piga_password iga_courses < backup_20260129.sql
```

---

## 🎯 Características Implementadas

✅ **Catálogo de Cursos**: Vista de cursos con información detallada  
✅ **Proceso de Compra**: Formulario con validación  
✅ **Historial de Compras**: Búsqueda por email  
✅ **Dashboard Admin**: Reportes y estadísticas de ventas  
✅ **Diseño Responsive**: Optimizado para mobile, tablet y desktop  
✅ **Docker Ready**: Fácil deployment con docker-compose  
✅ **Arquitectura Híbrida**: NestJS moderno + PHP legacy  
✅ **Base de Datos Centralizada**: Single source of truth

---

## 📝 Notas Importantes

### Para Revisión de Prueba Técnica

1. **Usar Docker es más rápido**: Solo ejecutar `docker-compose up --build`
2. **Todas las dependencias están instaladas**: No requiere configuración adicional
3. **Los datos de prueba están incluidos**: El `init.sql` carga cursos de ejemplo
4. **La aplicación es completamente funcional**: Todas las vistas y APIs funcionan

### Credenciales de Base de Datos (Docker)

```
Host: localhost
Port: 3306
Database: iga_courses
Username: iga_user
Password: iga_password
```

---

## 📄 Licencia

MIT License - Este proyecto es de código abierto.

---

## 👨‍💻 Autor

Proyecto desarrollado para IGA Courses

---

**⚡ Inicio Súper Rápido:**

**Opción 1 - Script Automático:**

```bash
# Windows:
start.bat

# Linux/Mac:
./start.sh
```

**Opción 2 - Docker Directo:**

```bash
docker-compose up --build
# Abrir http://localhost:5173
```

**🎉 ¡Sistema completo funcionando en minutos!**
