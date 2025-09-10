import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { RoomAddSchema } from '@/lib/validations';
import { ApiResponse, RoomAddRes } from '@/types/api';

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
    const validatedData = RoomAddSchema.parse(body);
    const { roomName } = validatedData;

    // 创建新房间
    const room = await prisma.room.create({
      data: {
        roomName,
        creator: user.username,
      }
    });

    const response: RoomAddRes = {
      roomId: room.id
    };

    return NextResponse.json<ApiResponse<RoomAddRes>>({
      message: '房间创建成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Room add error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>({
        message: error.message,
        code: 1,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      message: '房间创建失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
