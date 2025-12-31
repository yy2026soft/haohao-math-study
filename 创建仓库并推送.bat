@echo off
chcp 65001 >nul
title 创建GitHub仓库并部署
color 0A

echo.
echo ╔═════════════════════════════════════════════════════════════╗
echo ║           🌟 浩浩数学学习乐园 - 自动部署工具 🌟               ║
echo ╚═════════════════════════════════════════════════════════════╝
echo.

echo 用户名: yy2026soft
echo 仓库名: hao-hao-math-learning
echo.

echo 📋 正在推送代码到GitHub...
echo ────────────────────────────────────────────────────────────────
echo.

cd /d "%~dp0"
git push -u origin main 2>&1

if %errorlevel% neq 0 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 请先访问以下链接创建GitHub仓库：
    echo https://github.com/new?name=hao-hao-math-learning^&description=浩浩数学学习乐园^&visibility=public
    echo.
    echo 仓库创建后，请重新运行此脚本
    echo.
    timeout /t 3 >nul
    start https://github.com/new?name=hao-hao-math-learning^&description=浩浩数学学习乐园^&visibility=public
    echo 正在打开仓库创建页面...
) else (
    echo.
    echo ╔═════════════════════════════════════════════════════════════╗
    echo ║                    ✅ 推送成功！                              ║
    echo ╚═════════════════════════════════════════════════════════════╝
    echo.
    echo 📋 下一步：启用GitHub Pages
    echo ────────────────────────────────────────────────────────────────
    echo.
    echo 1️⃣ 访问仓库设置页面：
    echo    https://github.com/yy2026soft/hao-hao-math-learning/settings/pages
    echo.
    echo 2️⃣ 在Pages页面设置：
    echo    Source: 选择 "Deploy from a branch"
    echo    Branch: 选择 "main" 分支
    echo    Folder: 选择 "/ (root)"
    echo.
    echo 3️⃣ 点击蓝色 "Save" 按钮
    echo.
    echo 📌 您的永久访问地址将在2-3分钟后生效：
    echo    https://yy2026soft.github.io/hao-hao-math-learning
    echo.
    echo ╔═════════════════════════════════════════════════════════════╗
    echo ║       🎉 恭喜！几分钟后访问上面的地址即可使用！              ║
    echo ╚═════════════════════════════════════════════════════════════╝
)

echo.
pause