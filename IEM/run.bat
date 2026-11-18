@echo off
echo ========================================================
echo   Institute of Engineering and Management (IEM)
echo   Starting Admission Management Portal & Server...
echo ========================================================
cd /d "%~dp0"
if exist "backend\src\server.js" (
  cd backend
)
echo Open your browser at: http://localhost:5000
node src/server.js
pause
