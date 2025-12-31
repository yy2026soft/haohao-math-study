@echo off
echo ========================================
echo   浩浩数学学习乐园 - 手动部署
echo ========================================
echo.

cd /d "%~dp0"

echo 1. 检查Git状态...
git status
echo.

echo 2. 尝试推送到GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✓ 部署成功！
    echo ========================================
    echo.
    echo 请访问以下地址查看更新：
    echo https://yy2026soft.github.io/haohao-math-study/
    echo.
    echo GitHub Pages通常需要1-2分钟完成部署
) else (
    echo.
    echo ========================================
    echo   ✗ 部署失败
    echo ========================================
    echo.
    echo 请手动完成部署：
    echo 1. 访问 https://github.com/yy2026soft/haohao-math-study
    echo 2. 点击"Upload files"
    echo 3. 上传修改后的 index.html 和 script.js
    echo 4. 提交更改
    echo.
    echo 或者检查Git凭据是否正确配置
)

echo.
pause
