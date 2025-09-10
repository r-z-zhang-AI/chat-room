# 聊天室全栈项目

一个使用 Next.js + TypeScript + Prisma 构建的现代化聊天室应用。

## 🚀 功能特性

- **用户认证**: 注册、登录、JWT 令牌验证
- **实时聊天**: 房间管理、消息发送、实时更新
- **用户界面**: 现代化的响应式设计
- **数据持久化**: SQLite 数据库，Prisma ORM
- **Docker 部署**: 容器化部署支持

## 🛠️ 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT + bcryptjs
- **验证**: Zod
- **部署**: Docker + Docker Compose

## 📦 快速开始

### 本地开发

1. **安装依赖**
```bash
npm install
```

2. **初始化数据库**
```bash
npx prisma generate
npx prisma db push
```

3. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### Docker 部署

1. **构建并启动服务**
```bash
docker-compose up --build
```

2. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📚 API 文档

### 认证接口

#### 注册
- **URL**: `/api/auth/register`
- **方法**: `POST`
- **参数**: 
```json
{
  "username": "string",
  "password": "string",
  "email": "string" // 可选
}
```

#### 登录
- **URL**: `/api/auth/login`
- **方法**: `POST`
- **参数**:
```json
{
  "username": "string",
  "password": "string"
}
```

### 房间管理

#### 创建房间
- **URL**: `/api/room/add`
- **方法**: `POST`

#### 获取房间列表
- **URL**: `/api/room/list`
- **方法**: `GET`

#### 删除房间
- **URL**: `/api/room/delete`
- **方法**: `POST`

### 消息管理

#### 发送消息
- **URL**: `/api/message/add`
- **方法**: `POST`

#### 获取房间消息
- **URL**: `/api/room/message/list`
- **方法**: `GET`

#### 获取消息更新
- **URL**: `/api/room/message/getUpdate`
- **方法**: `GET`

## 🔧 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 数据库操作
npm run db:push      # 推送数据库变更
npm run db:migrate   # 创建数据库迁移
npm run db:studio    # 打开 Prisma Studio

# 代码检查
npm run lint
```
