@echo off
REM Start the backend
cd backend
start /B node dist/bootstrap.js
timeout /t 5 /nobreak

REM Start a simple HTTP server for the frontend
cd ..\frontend\dist
start npx http-server -p 4173
