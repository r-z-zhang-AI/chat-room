#!/bin/bash

echo "🧪 测试聊天室应用所有页面"
echo "========================="

BASE_URL="http://localhost:3000"

echo "📋 测试页面列表："
echo "1. 首页: $BASE_URL"
echo "2. 认证页面: $BASE_URL/auth"
echo "3. 聊天室: $BASE_URL/ChatRoom"
echo ""

echo "🔍 检查开发服务器是否运行..."
if curl -s "$BASE_URL" > /dev/null; then
    echo "✅ 开发服务器正在运行"
else
    echo "❌ 开发服务器未运行，请先执行 npm run dev"
    exit 1
fi

echo ""
echo "📱 测试各个页面："

# 测试首页
echo -n "首页 ($BASE_URL): "
if curl -s "$BASE_URL" | grep -q "DOCTYPE\|html"; then
    echo "✅ 正常"
else
    echo "❌ 错误"
fi

# 测试认证页面
echo -n "认证页面 ($BASE_URL/auth): "
if curl -s "$BASE_URL/auth" | grep -q "DOCTYPE\|html"; then
    echo "✅ 正常"
else
    echo "❌ 错误"
fi

# 测试聊天室页面
echo -n "聊天室 ($BASE_URL/ChatRoom): "
if curl -s "$BASE_URL/ChatRoom" | grep -q "DOCTYPE\|html"; then
    echo "✅ 正常"
else
    echo "❌ 错误"
fi

echo ""
echo "🎉 页面测试完成！"
echo "💡 在浏览器中访问: $BASE_URL"
