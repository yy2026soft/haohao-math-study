@echo off
echo 正在打开GitHub仓库创建页面...
echo.
echo 请按照提示创建仓库：
echo   - Repository name: hao-hao-math-learning
echo   - Description: 浩浩数学学习乐园
echo   - ☑️ Public (必须公开)
echo   - ⬜ 不要勾选 Add a README file
echo.
timeout /t 2 >nul

:: 打开GitHub仓库创建页面
start https://github.com/new?name=hao-hao-math-learning^&description=浩浩数学学习乐园^&visibility=public

echo.
echo 仓库创建页面已打开，请完成创建后：
echo   1. 关闭此窗口
echo   2. 双击 "一键部署到GitHub.bat" 完成部署
echo.
pause