import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ApiResponse, RoomListRes, RoomPreviewInfo } from '@/types/api';

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

    // 获取所有房间及其最后一条消息
    const rooms = await prisma.room.findMany({
      include: {
        messages: {
          orderBy: { time: 'desc' },
          take: 1,
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const roomsWithLastMessage: RoomPreviewInfo[] = rooms.map(room => ({
      roomId: room.id,
      roomName: room.roomName,
      lastMessage: room.messages.length > 0 ? {
        messageId: room.messages[0].id,
        roomId: room.messages[0].roomId,
        sender: room.messages[0].sender,
        content: room.messages[0].content,
        time: Number(room.messages[0].time),
      } : null
    }));

    const response: RoomListRes = {
      rooms: roomsWithLastMessage
    };

    return NextResponse.json<ApiResponse<RoomListRes>>({
      message: '获取房间列表成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Room list error:', error);
    
    return NextResponse.json<ApiResponse>({
      message: '获取房间列表失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
