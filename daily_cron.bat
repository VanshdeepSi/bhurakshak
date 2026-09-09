@echo off
echo ========================================================
echo   SIH26001 - Daily Autonomous Model Training Script
echo ========================================================
echo.
echo Running at %DATE% %TIME%
echo.

REM Change to project directory
cd /d "E:\code\sih2026_landslide_ner"

REM Run the autotraining script (simulates ingestion and retrains)
python src\auto_train.py

echo.
echo Auto-Training Complete!
echo ========================================================
