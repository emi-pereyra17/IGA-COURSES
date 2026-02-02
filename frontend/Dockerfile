# ============================================
# STAGE 1: Build - Compilar la aplicación Vite/React
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inline estas variables en tiempo de build (necesarias para las APIs)
ARG VITE_API_NEST=http://localhost:3000/api
ARG VITE_API_PHP=http://localhost:8080
ENV VITE_API_NEST=$VITE_API_NEST
ENV VITE_API_PHP=$VITE_API_PHP

RUN npm run build

# ============================================
# STAGE 2: Production - Servir el build
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo el build desde el stage anterior
COPY --from=builder /app/dist ./dist

# Instalar serve en la imagen (evita depender de npx/red en el arranque)
RUN npm install -g serve

# Servir la app estática en el puerto 5173 (igual que docker-compose)
EXPOSE 5173

# Servir la SPA (compatible con React Router)
CMD ["serve", "-s", "dist", "-l", "5173"]
