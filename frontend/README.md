# Frontend React - IGA Courses 🍳

Aplicación web moderna para la visualización, compra y gestión de cursos de gastronomía profesional.

## 🎯 Funcionalidades

✅ **Home**: Catálogo de cursos con diseño profesional (cards con información detallada)  
✅ **Modal de Compra**: Formulario intuitivo para adquirir cursos (Nombre, Email, Celular)  
✅ **Mis Cursos**: Consulta de historial de compras por email  
✅ **Admin Dashboard**: Panel administrativo con reporte de ventas y estadísticas  
✅ **Diseño Responsive**: Optimizado para móviles, tablets y desktop  
✅ **TailwindCSS**: Estilos modernos y profesionales

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📋 Configuración

### Variables de Entorno `.env`

```env
# API NestJS (Backend principal)
VITE_API_NEST=http://localhost:3000/api

# API PHP CodeIgniter (Admin)
VITE_API_PHP=http://localhost:8080
```

Las URLs por defecto están configuradas en `api.js` y se pueden sobrescribir con variables de entorno.

## 📁 Estructura del Proyecto

```
frontend/
├── components/              # Componentes reutilizables
│   └── PurchaseModal.jsx   # Modal para compra de cursos
├── pages/                   # Páginas de la aplicación
│   ├── Layout.jsx          # Layout principal (Header + Footer)
│   ├── Home.jsx            # Catálogo de cursos
│   ├── MyCourses.jsx       # Historial de compras por email
│   └── Admin.jsx           # Dashboard administrativo
├── api.js                   # Configuración de Axios y APIs
├── App.jsx                  # Router y rutas principales
├── main.jsx                 # Entry point de la aplicación
├── index.css                # Estilos globales y clases TailwindCSS
├── index.html               # HTML principal
├── tailwind.config.js       # Configuración de TailwindCSS
├── vite.config.js           # Configuración de Vite
├── postcss.config.js        # Configuración de PostCSS
├── package.json             # Dependencias y scripts
└── .env                     # Variables de entorno
```

## 🌐 Rutas de la Aplicación

| Ruta          | Componente      | Descripción                            |
| ------------- | --------------- | -------------------------------------- |
| `/`           | `Home.jsx`      | Catálogo de cursos con botón "Comprar" |
| `/my-courses` | `MyCourses.jsx` | Búsqueda de compras por email          |
| `/admin`      | `Admin.jsx`     | Dashboard con reporte de ventas        |

## 📦 Comandos Disponibles

```bash
# Desarrollo (Puerto 5173)
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 🎨 Tecnologías y Características

### Stack Tecnológico

- ⚛️ **React 18** - Framework UI
- ⚡ **Vite** - Build tool ultra-rápido
- 🎨 **TailwindCSS 3** - Estilos utility-first
- 🛣️ **React Router DOM 6** - Navegación
- 📡 **Axios** - Cliente HTTP

### Diseño UI/UX

- **Paleta de colores**: Naranja cálido (primary-500: #f97316)
- **Tipografía**: Inter (sistema sans-serif moderno)
- **Componentes**: Cards, modales, tablas con efectos hover
- **Animaciones**: Transiciones suaves y spinners de carga
- **Responsive**: Mobile-first con Tailwind breakpoints (md, lg)

### Características de Código

- ✅ Componentes funcionales con React Hooks
- ✅ Manejo de estados con useState y useEffect
- ✅ Axios con interceptores para manejo de errores
- ✅ Variables de entorno con Vite
- ✅ Estilos personalizados con @layer de Tailwind
- ✅ Validación de formularios HTML5

## 🔌 APIs Consumidas

### NestJS API (Puerto 3000)

- `GET /api/courses` - Lista de cursos disponibles
- `POST /api/compras` - Registro de compra
- `GET /api/compras/historial/:email` - Historial de compras

### PHP CodeIgniter API (Puerto 8080)

- `GET /api/reportes/ventas` - Reporte de ventas

## 🎯 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Carrito de compras
- [ ] Integración con pasarela de pagos
- [ ] Filtros y búsqueda de cursos
- [ ] Sistema de calificaciones y reseñas
- [ ] Panel de instructor
- [ ] Notificaciones en tiempo real
