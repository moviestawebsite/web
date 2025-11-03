@echo off
cd /d "D:\Documents\My Programming Projects\Html\Movie"
:loop
git add .
git commit -m "Auto update: %date% %time%" 2>nul
git push origin main 2>nul
timeout /t 30 >nul
goto loop