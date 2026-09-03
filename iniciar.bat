@echo off
title Sistema de Gestion Paniol
echo.
echo  ================================
echo   Iniciando Sistema Paniol...
echo  ================================
echo.

:: Ir a la carpeta donde esta este archivo
cd /d "%~dp0"

:: Verificar que npm este instalado
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] No se encontro Node.js. Instalar desde nodejs.org
    pause
    exit /b
)

echo  Levantando el servidor...
start "Servidor Paniol" cmd /k "npm run start"

echo  Esperando que el servidor arranque...
timeout /t 5 /nobreak > nul

echo  Abriendo el navegador...
start http://localhost:5173

echo.
echo  Listo! El sistema esta corriendo.
echo  Para cerrarlo, cerrar la ventana "Servidor Paniol".
echo.
timeout /t 3 /nobreak > nul
exit
