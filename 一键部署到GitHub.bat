@echo off
chcp 65001 >nul
title 浩浩数学学习乐园 - GitHub一键部署
color 0A

echo.
echo ╔═════════════════════════════════════════════════════════════╗
echo ║        🌟 浩浩数学学习乐园 - GitHub一键部署工具 🌟          ║
echo ╚═════════════════════════════════════════════════════════════╝
echo.

echo 📋 第1步：确认当前状态
echo ────────────────────────────────────────────────────────────────
cd /d "%~dp0"
git status
echo.
if %errorlevel% neq 0 (
    echo ❌ Git未初始化或出错
    pause
    exit /b 1
)

echo.
echo 📋 第2步：输入GitHub信息
echo ────────────────────────────────────────────────────────────────
echo.
set /p username="请输入您的GitHub用户名: "
echo.
echo 您的仓库名将自动设为: hao-hao-math-learning
echo.

echo 📋 第3步：配置远程仓库
echo ────────────────────────────────────────────────────────────────
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%username%/hao-hao-math-learning.git
git branch -M main
echo ✅ 远程仓库配置完成
echo.

echo 📋 第4步：推送到GitHub
echo ────────────────────────────────────────────────────────────────
echo.
echo ⏳ 正在推送代码到GitHub...
echo    这可能需要一些时间，请耐心等待...
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ 推送失败！可能的原因：
    echo    1. GitHub用户名输入错误
    echo    2. 仓库还未在GitHub上创建
    echo    3. 网络连接问题
    echo.
    echo 请先访问以下链接创建仓库：
    echo https://github.com/new?name=hao-hao-math-learning^&description=浩浩数学学习乐园^&visibility=public
    echo.
) else (
    echo.
    echo ╔═════════════════════════════════════════════════════════════╗
    echo ║                    ✅ 部署成功！                              ║
    echo ╚═════════════════════════════════════════════════════════════╝
    echo.
    echo 📋 第5步：启用GitHub Pages
    echo ────────────────────────────────────────────────────────────────
    echo.
    echo 请按以下步骤操作：
    echo.
    echo 1️⃣ 访问您的仓库：
    echo    https://github.com/%username%/hao-hao-math-learning/settings/pages
    echo.
    echo 2️⃣ 在Pages页面设置：
    echo    Source: Deploy from a branch
    echo    Branch: main  →  /(root)
    echo.
    echo 3️⃣ 点击 Save 按钮
    echo.
    echo 📌 您的永久访问地址将在2-3分钟后生效：
    echo    https://%username%.github.io/hao-hao-math-learning
    echo.
    echo ╔═════════════════════════════════════════════════════════════╗
    echo ║          🎉 恭喜！几分钟后您就拥有永久访问地址了！          ║
    echo ╚═════════════════════════════════════════════════════════════╝
)

echo.
pause