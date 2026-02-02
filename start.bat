@echo off
REM ==========================================
REM Script de Inicio - IGA Courses (Windows)
REM Permite elegir entre Docker o Local
REM ==========================================

color 0B
title IGA Courses - Sistema de Gestion

echo.
echo ========================================
echo    IGA Courses - Sistema de Gestion
echo ========================================
echo.

REM Menu principal
echo Selecciona el modo de ejecucion:
echo.
echo   1) Docker (Recomendado - Todo automatizado)
echo   2) Local (Desarrollo - 3 terminales)
echo   3) Salir
echo.

set /p option="Opcion [1-3]: "

if "%option%"=="1" goto docker
if "%option%"=="2" goto local
if "%option%"=="3" goto exit
goto invalid

:docker
echo.
echo [Docker] Iniciando con Docker...
echo.

REM Verificar Docker
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no esta corriendo
    echo Por favor inicia Docker Desktop
    pause
    exit /b 1
)

echo [OK] Docker esta disponible
echo.
echo Construyendo e iniciando servicios...
echo.

docker-compose up --build
goto end

:local
echo.
echo [Local] Iniciando en modo local...
echo.

REM Verificar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    pause
    exit /b 1
)
echo [OK] Node.js disponible

REM Verificar PHP
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PHP no esta instalado
    pause
    exit /b 1
)
echo [OK] PHP disponible

echo.
echo [INFO] Asegurate de que MySQL este corriendo en XAMPP
echo.
echo ================================================
echo    IMPORTANTE: Se abriran 3 terminales
echo    NO cierres ninguna de ellas
echo ================================================
echo.
echo Verificando dependencias...

REM Verificar dependencias NestJS
if not exist "backend-nest\node_modules" (
    echo [*] Instalando dependencias de Backend NestJS...
    cd backend-nest
    call npm install
    cd ..
) else (
    echo [OK] Backend NestJS - Dependencias ya instaladas
)

REM Verificar dependencias PHP
if not exist "backend-php\vendor" (
    echo [*] Instalando dependencias de Backend PHP...
    cd backend-php
    call composer install
    cd ..
) else (
    echo [OK] Backend PHP - Dependencias ya instaladas
)

REM Verificar dependencias Frontend
if not exist "frontend\node_modules" (
    echo [*] Instalando dependencias de Frontend...
    cd frontend
    call npm install
    cd ..
) else (
    echo [OK] Frontend - Dependencias ya instaladas
)

echo.
echo [OK] Todas las dependencias estan listas
echo.
echo Abriendo terminales...
echo.

REM Abrir terminal para NestJS
start "NestJS API - Puerto 3000" cmd /k "cd /d %CD%\backend-nest && echo [NestJS] Iniciando servidor... && npm run start:dev"

REM Esperar 2 segundos
timeout /t 2 >nul

REM Abrir terminal para PHP
start "PHP API - Puerto 8080" cmd /k "cd /d %CD%\backend-php && echo [PHP] Iniciando servidor... && php -S localhost:8080 -t public"

REM Esperar 2 segundos
timeout /t 2 >nul

REM Abrir terminal para Frontend
start "Frontend - Puerto 5173" cmd /k "cd /d %CD%\frontend && echo [Frontend] Iniciando servidor... && npm run dev"

echo [OK] Terminales abiertas
echo.
echo URLs de acceso:
echo   Frontend:  http://localhost:5173
echo   NestJS:    http://localhost:3000
echo   PHP:       http://localhost:8080
echo.
echo Presiona Ctrl+C en cada terminal para detener los servicios
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
goto end

:invalid
echo.
echo [ERROR] Opcion invalida
pause
exit /b 1

:exit
echo.
echo Saliendo...
exit /b 0

:end
