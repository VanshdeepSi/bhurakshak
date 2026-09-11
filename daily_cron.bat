@echo off
echo ========================================================
echo   BHURAKSHAK - Daily Autonomous Model Training Script
echo ========================================================
echo.
echo Running at %DATE% %TIME%
echo.

REM Change to script directory
cd /d "%~dp0"

REM Run the autotraining pipeline
python src\auto_train.py

echo.
echo Auto-Training Complete!
echo ========================================================
