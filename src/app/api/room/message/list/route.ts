import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ApiResponse, RoomMessageListRes } from '@/types/api';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get('roomId');
    
    if (!roomIdStr) {
      return NextResponse.json<ApiResponse>({
        message: '缺少房间ID参数',
        code: 1,
        data: null
      }, { status: 400 });
    }

    const roomId = parseInt(roomIdStr);
    if (isNaN(roomId)) {
      return NextResponse.json<ApiResponse>({
        message: '房间ID格式错误',
        code: 1,
        data: null
      }, { status: 400 });
    }

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

    // 获取房间的所有消息
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { time: 'asc' }
    });

    const formattedMessages = messages.map(msg => ({
      messageId: msg.id,
      roomId: msg.roomId,
      sender: msg.sender,
      content: msg.content,
      time: Number(msg.time),
    }));

    const response: RoomMessageListRes = {
      messages: formattedMessages
    };

    return NextResponse.json<ApiResponse<RoomMessageListRes>>({
      message: '获取消息列表成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Room message list error:', error);
    
    return NextResponse.json<ApiResponse>({
      message: '获取消息列表失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
