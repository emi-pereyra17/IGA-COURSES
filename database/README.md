# 🗄️ Database - Scripts SQL

Contiene los scripts SQL para la base de datos del proyecto.

## 📋 Archivos

### `init.sql`
Script de inicialización que contiene:
- Creación de la base de datos `iga_courses`
- Definición de todas las tablas
- Datos de prueba (3 cursos de gastronomía)

## 🏗️ Esquema de Base de Datos

### Tabla: `courses`
```sql
id              INT (PK, AUTO_INCREMENT)
name            VARCHAR(255)
description     TEXT
price           DECIMAL(10, 2)
detail          TEXT
image_url       VARCHAR(500)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: `clients`
```sql
id              INT (PK, AUTO_INCREMENT)
name            VARCHAR(255)
email           VARCHAR(255) UNIQUE
phone           VARCHAR(20)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: `purchases`
```sql
id              INT (PK, AUTO_INCREMENT)
course_id       INT (FK → courses.id)
client_id       INT (FK → clients.id)
purchase_date   DATETIME
created_at      TIMESTAMP
```

## 📊 Relaciones

- `purchases.course_id` → `courses.id` (ON DELETE CASCADE)
- `purchases.client_id` → `clients.id` (ON DELETE CASCADE)

## 🚀 Ejecución

### Desde MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu servidor
3. File → Open SQL Script → Selecciona `init.sql`
4. Ejecuta (⚡ o Ctrl+Shift+Enter)

### Desde Línea de Comandos
```bash
# Windows PowerShell
mysql -u root -p < init.sql

# O con ruta completa de MySQL
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < init.sql
```

### Desde phpMyAdmin
1. Accede a phpMyAdmin
2. Clic en "Importar"
3. Selecciona el archivo `init.sql`
4. Clic en "Continuar"

## ✅ Verificación

```sql
-- Verificar base de datos
SHOW DATABASES;

-- Usar la base de datos
USE iga_courses;

-- Ver tablas
SHOW TABLES;

-- Verificar datos de cursos
SELECT * FROM courses;

-- Contar registros
SELECT 
  (SELECT COUNT(*) FROM courses) as total_courses,
  (SELECT COUNT(*) FROM clients) as total_clients,
  (SELECT COUNT(*) FROM purchases) as total_purchases;
```

## 📦 Datos de Prueba Incluidos

### Cursos (3 registros)
1. **Cocina Italiana Profesional** - $299.99
2. **Repostería Francesa: Del Croissant al Macaron** - $349.99
3. **Cocina Peruana Contemporánea** - $279.99

## 🔄 Migraciones Futuras

Para agregar más scripts SQL, usa esta nomenclatura:
```
001_init.sql                    (Ya ejecutado)
002_add_categories_table.sql
003_add_user_authentication.sql
```

## 🐳 Docker

Este script también se utilizará en el contenedor de MySQL mediante Docker Compose:

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
```

## 🛠️ Mantenimiento

### Backup
```bash
mysqldump -u root -p iga_courses > backup_$(date +%Y%m%d).sql
```

### Restaurar
```bash
mysql -u root -p iga_courses < backup_20260128.sql
```

### Limpiar y reiniciar
```sql
DROP DATABASE IF EXISTS iga_courses;
SOURCE init.sql;
```

## 📝 Notas

- El script usa `IF NOT EXISTS` para evitar errores en ejecuciones múltiples
- Todas las tablas usan `InnoDB` para soporte de transacciones
- Charset: `utf8mb4_unicode_ci` para compatibilidad completa con Unicode
- Los timestamps se actualizan automáticamente
- Las relaciones tienen `ON DELETE CASCADE` para integridad referencial
