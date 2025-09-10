# 简约聊天室

一个基于 Next.js 和 Prisma 的简单聊天室应用。

## 功能特性

- 🔐 用户注册和登录
- 💬 实时聊天消息
- 🏠 多房间支持
- 👥 房间成员查看
- 📱 响应式设计

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT + bcryptjs
- **样式**: 原生 CSS

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 数据库设置

```bash
# 生成数据库
npm run db:push

# (可选) 查看数据库
npm run db:studio
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 项目结构

```
src/
├── app/
│   ├── api/          # API 路由
│   ├── login/        # 登录页面
│   ├── chat/         # 聊天页面
│   └── page.tsx      # 首页重定向
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
└── lib/              # 数据库和认证配置
```

## API 接口

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 房间
- `GET /api/room/list` - 获取房间列表
- `POST /api/room/add` - 创建房间
- `GET /api/room/members` - 获取房间成员

### 消息
- `GET /api/message/list` - 获取消息列表
- `POST /api/message/add` - 发送消息

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t chat-room .

# 运行容器
docker run -p 3000:3000 chat-room
```

### 传统部署

```bash
# 构建应用
npm run build

# 启动应用
npm start
```

## 环境变量

创建 `.env` 文件：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
```

## 开发说明

- 数据库文件位于 `prisma/dev.db`
- JWT 密钥用于用户认证
- 支持热重载开发
- 自动 TypeScript 类型检查

## 许可证

MIT License
