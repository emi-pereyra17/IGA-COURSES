# ============================================
# STAGE 1: Build - Compilación de la aplicación
# ============================================
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluidas devDependencies para el build)
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar la aplicación TypeScript
RUN npm run build

# ============================================
# STAGE 2: Production - Imagen final optimizada
# ============================================
FROM node:20-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no privilegiado
RUN addgroup -g 1001 nestjs && \
    adduser -D -u 1001 -G nestjs nestjs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el código compilado desde el stage builder
COPY --from=builder /app/dist ./dist

# Las variables de entorno (DB_HOST, etc.) se inyectan en runtime desde docker-compose (env_file: .env.docker)

# Cambiar propietario de los archivos al usuario nestjs
RUN chown -R nestjs:nestjs /app

# Cambiar a usuario no privilegiado
USER nestjs

# Exponer el puerto
EXPOSE 3000

# Variable de entorno para producción
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
