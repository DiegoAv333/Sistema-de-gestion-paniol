@echo off
title Backup Paniol - Google Drive
color 0A

:: ====================================================
:: CONFIGURACION
:: ====================================================
set DB_NAME=gestion_paniol
set DB_USER=root
set DB_PASS=
set MYSQLDUMP=C:\xampp\mysql\bin\mysqldump.exe
set RCLONE=C:\rclone\rclone.exe
set DRIVE_FOLDER=gdrive:Backups/Paniol
set BACKUP_DIR=%~dp0backups
set DIAS_A_CONSERVAR=30

:: ====================================================
:: INICIO
:: ====================================================
echo.
echo  ==========================================
echo   Backup Sistema Paniol
echo  ==========================================
echo.

:: Verificar que mysqldump existe
if not exist "%MYSQLDUMP%" (
    echo  [ERROR] No se encontro mysqldump.exe en:
    echo  %MYSQLDUMP%
    echo  Verificar que XAMPP este instalado correctamente.
    pause
    exit /b 1
)

:: Verificar que rclone existe
if not exist "%RCLONE%" (
    echo  [ERROR] No se encontro rclone.exe en:
    echo  %RCLONE%
    echo  Verificar que rclone este en C:\rclone\
    pause
    exit /b 1
)

:: Crear carpeta de backups si no existe
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: Nombre del archivo con fecha y hora (formato fijo)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set DT=%%I
set YYYY=%DT:~0,4%
set MM=%DT:~4,2%
set DD=%DT:~6,2%
set HH=%DT:~8,2%
set MIN=%DT:~10,2%

set FILENAME=backup_%DB_NAME%_%YYYY%-%MM%-%DD%_%HH%-%MIN%.sql
set FILEPATH=%BACKUP_DIR%\%FILENAME%

:: ====================================================
:: PASO 1 - EXPORTAR LA BASE DE DATOS
:: ====================================================
echo  [1/3] Exportando base de datos...

"%MYSQLDUMP%" -u %DB_USER% --password=%DB_PASS% %DB_NAME% > "%FILEPATH%"

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] No se pudo exportar la base de datos.
    echo  Verificar que MySQL este corriendo en XAMPP.
    echo.
    pause
    exit /b 1
)

echo  OK - Archivo creado: %FILENAME%
echo.

:: ====================================================
:: PASO 2 - SUBIR A GOOGLE DRIVE
:: ====================================================
echo  [2/3] Subiendo a Google Drive...

"%RCLONE%" copy "%FILEPATH%" "%DRIVE_FOLDER%" --progress

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] No se pudo subir a Google Drive.
    echo  Verificar conexion a internet y configuracion de rclone.
    echo  El backup local fue guardado en: %FILEPATH%
    echo.
    pause
    exit /b 1
)

echo  OK - Subido a Google Drive en: %DRIVE_FOLDER%
echo.

:: ====================================================
:: PASO 3 - LIMPIAR BACKUPS LOCALES ANTIGUOS
:: ====================================================
echo  [3/3] Limpiando backups locales mayores a %DIAS_A_CONSERVAR% dias...

forfiles /p "%BACKUP_DIR%" /s /m *.sql /d -%DIAS_A_CONSERVAR% /c "cmd /c del @path" 2>nul

echo  OK - Limpieza completada.
echo.
echo  ==========================================
echo   Backup finalizado correctamente!
echo   Archivo: %FILENAME%
echo  ==========================================
echo.

timeout /t 5 /nobreak > nul
exit
