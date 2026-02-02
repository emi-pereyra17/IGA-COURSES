# ============================================
# Backend PHP - CodeIgniter 4 con Apache
# ============================================
FROM php:8.2-apache

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias del sistema y extensiones PHP
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mysqli \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite de Apache (necesario para CodeIgniter)
RUN a2enmod rewrite headers

# Configurar Apache para CodeIgniter
RUN echo '<VirtualHost *:80>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copiar archivos del proyecto
COPY . /var/www/html/

# Las variables de entorno (DB_HOST, CI_ENVIRONMENT, etc.) se inyectan en runtime desde docker-compose (env_file: .env.docker en la raíz)

# Instalar dependencias de Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Crear directorios necesarios y dar permisos
RUN mkdir -p writable/cache writable/logs writable/session writable/uploads \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 writable

# Exponer puerto 80
EXPOSE 80

# Health check (ruta real: api/health según Routes.php)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

# Iniciar Apache en primer plano
CMD ["apache2-foreground"]
