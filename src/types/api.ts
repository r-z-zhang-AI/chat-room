// 统一返回模式
export interface ApiResponse<T = any> {
  message: string;
  code: number;
  data: T | null;
}

// 消息类型
export interface Message {
  messageId: number;
  roomId: number;
  sender: string;
  content: string;
  time: number;
}

// 房间预览信息
export interface RoomPreviewInfo {
  roomId: number;
  roomName: string;
  lastMessage: Message | null;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email?: string;
}

// API 请求参数类型
export interface RoomAddArgs {
  user: string;
  roomName: string;
}

export interface RoomAddRes {
  roomId: number;
}

export interface RoomListRes {
  rooms: RoomPreviewInfo[];
}

export interface RoomDeleteArgs {
  user: string;
  roomId: number;
}

export interface MessageAddArgs {
  roomId: number;
  content: string;
  sender: string;
}

export interface RoomMessageListArgs {
  roomId: number;
}

export interface RoomMessageListRes {
  messages: Message[];
}

export interface RoomMessageGetUpdateArgs {
  roomId: number;
  sinceMessageId: number;
}

export interface RoomMessageGetUpdateRes {
  messages: Message[];
}

// 房间成员相关类型
export interface RoomMember {
  id: number;
  name: string;
  avatar?: string;
  status: string;
}

export interface RoomMembersRes {
  members: RoomMember[];
}

// 认证相关类型
export interface LoginArgs {
  username: string;
  password: string;
}

export interface RegisterArgs {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
