@echo off
echo ========================================
echo   IGA COURSES - Instalacion
echo ========================================
echo.
echo Instalando dependencias de todos los proyectos...
echo.

echo [1/2] Instalando dependencias de Backend NestJS...
cd backend-nest
call npm install
cd ..
echo.

echo [2/2] Instalando dependencias de Frontend React...
cd frontend
call npm install
cd ..
echo.

echo ========================================
echo Instalacion completada!
echo ========================================
echo.
echo Siguiente paso: Ejecutar start-all.bat
echo O seguir las instrucciones en INSTRUCCIONES.txt
echo.
pause
