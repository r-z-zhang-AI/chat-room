import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { RoomDeleteSchema } from '@/lib/validations';
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
    const validatedData = RoomDeleteSchema.parse(body);
    const { roomId } = validatedData;

    // 检查房间是否存在以及用户是否有权限删除
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

    if (room.creator !== user.username) {
      return NextResponse.json<ApiResponse>({
        message: '没有权限删除此房间',
        code: 1,
        data: null
      }, { status: 403 });
    }

    // 删除房间（级联删除消息）
    await prisma.room.delete({
      where: { id: roomId }
    });

    return NextResponse.json<ApiResponse>({
      message: '房间删除成功',
      code: 0,
      data: null
    });

  } catch (error) {
    console.error('Room delete error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>({
        message: error.message,
        code: 1,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      message: '房间删除失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
