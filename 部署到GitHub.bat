@echo off
echo 🚀 浩浩数学学习乐园 - GitHub部署工具
echo.
echo 请按照以下步骤操作：
echo.
echo 1️⃣ 首先，请在GitHub上创建一个名为 "hao-hao-math-learning" 的仓库
echo 2️⃣ 然后，将下面的 "您的用户名" 替换为您的实际GitHub用户名
echo.
set /p username="请输入您的GitHub用户名: "
echo.
echo 正在配置远程仓库...
git remote add origin https://github.com/%username%/hao-hao-math-learning.git
git branch -M main
echo.
echo 正在推送到GitHub...
git push -u origin main
echo.
echo ✅ 推送完成！
echo.
echo 📋 接下来请在GitHub仓库中启用Pages：
echo    1. 进入仓库 → Settings → Pages
echo    2. Source: Deploy from a branch
echo    3. Branch: main → /(root)
echo    4. 点击Save
echo.
echo 🎉 几分钟后您的网站就可以通过以下地址访问：
echo    https://%username%.github.io/hao-hao-math-learning
echo.
pause