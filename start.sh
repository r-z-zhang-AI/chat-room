#!/bin/bash

echo "🚀 启动聊天室全栈项目"
echo "========================"

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

# 检查是否安装了 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🗄️ 初始化数据库..."
npx prisma generate
npx prisma db push

echo "🔧 启动开发服务器..."
npm run dev

echo "✅ 项目启动完成！"
echo "📱 打开浏览器访问: http://localhost:3000"
