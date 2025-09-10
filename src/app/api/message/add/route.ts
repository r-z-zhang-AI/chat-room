import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { MessageAddSchema } from '@/lib/validations';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        message: '未授权访问',
        code: 1,
        data: null
      }, { status: 401 });
    }

    const body = await request.json();
    
    // 验证输入数据
    const validatedData = MessageAddSchema.parse(body);
    const { roomId, content } = validatedData;

    // 检查房间是否存在
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return NextResponse.json<ApiResponse>({
        message: '房间不存在',
        code: 1,
        data: null
      }, { status: 404 });
    }

    // 创建新消息
    const message = await prisma.message.create({
      data: {
        content,
        sender: user.username,
        roomId,
        time: BigInt(Date.now()),
      }
    });

    // 更新房间的最后更新时间
    await prisma.room.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json<ApiResponse>({
      message: '消息发送成功',
      code: 0,
      data: null
    });

  } catch (error) {
    console.error('Message add error:', error);
    
    // 如果是Zod验证错误
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json<ApiResponse>({
        message: '输入数据验证失败',
        code: 1,
        data: null
      }, { status: 400 });
    }
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>({
        message: error.message,
        code: 1,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      message: '消息发送失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
