@echo off
echo 正在启动浩浩数学学习乐园服务器...
echo.
echo 服务器启动后，请访问以下地址：
echo http://localhost:8080
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
cd /d "%~dp0"
python -m http.server 8080
pause