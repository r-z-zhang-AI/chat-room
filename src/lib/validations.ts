import { z } from 'zod';

// 用户相关验证
export const RegisterSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
  email: z.string().email().optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
});

// 房间相关验证
export const RoomAddSchema = z.object({
  roomName: z.string().min(1).max(50),
});

export const RoomDeleteSchema = z.object({
  roomId: z.number().int().positive(),
});

// 消息相关验证
export const MessageAddSchema = z.object({
  roomId: z.number().int().positive(),
  content: z.string().min(1).max(1000),
});

export const RoomMessageListSchema = z.object({
  roomId: z.number().int().positive(),
});

export const RoomMessageGetUpdateSchema = z.object({
  roomId: z.number().int().positive(),
  sinceMessageId: z.number().int().min(0),
});
