import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ApiResponse, RoomMessageGetUpdateRes } from '@/types/api';

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
    const sinceMessageIdStr = searchParams.get('sinceMessageId');
    
    if (!roomIdStr || !sinceMessageIdStr) {
      return NextResponse.json<ApiResponse>({
        message: '缺少必要参数',
        code: 1,
        data: null
      }, { status: 400 });
    }

    const roomId = parseInt(roomIdStr);
    const sinceMessageId = parseInt(sinceMessageIdStr);
    
    if (isNaN(roomId) || isNaN(sinceMessageId)) {
      return NextResponse.json<ApiResponse>({
        message: '参数格式错误',
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

    // 获取指定消息ID之后的新消息
    const messages = await prisma.message.findMany({
      where: { 
        roomId,
        id: { gt: sinceMessageId }
      },
      orderBy: { time: 'asc' }
    });

    const formattedMessages = messages.map(msg => ({
      messageId: msg.id,
      roomId: msg.roomId,
      sender: msg.sender,
      content: msg.content,
      time: Number(msg.time),
    }));

    const response: RoomMessageGetUpdateRes = {
      messages: formattedMessages
    };

    return NextResponse.json<ApiResponse<RoomMessageGetUpdateRes>>({
      message: '获取更新消息成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Room message update error:', error);
    
    return NextResponse.json<ApiResponse>({
      message: '获取更新消息失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
