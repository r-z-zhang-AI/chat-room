import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { ApiResponse } from '@/types/api';

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

    // 获取在这个房间发过消息的所有用户
    const roomMembers = await prisma.user.findMany({
      where: {
        messages: {
          some: {
            roomId: roomId
          }
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    // 如果房间没有消息，至少包含房间创建者
    if (roomMembers.length === 0) {
      const creator = await prisma.user.findUnique({
        where: { username: room.creator },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });

      if (creator) {
        roomMembers.push(creator);
      }
    }

    // 转换为前端需要的格式
    const formattedMembers = roomMembers.map(member => ({
      id: member.id,
      name: member.username,
      avatar: member.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}` : undefined,
      status: 'online' // 简单起见，假设都在线，后续可以添加真实的在线状态
    }));

    return NextResponse.json<ApiResponse>({
      message: '获取房间成员成功',
      code: 0,
      data: { members: formattedMembers }
    });

  } catch (error) {
    console.error('Room members error:', error);
    
    return NextResponse.json<ApiResponse>({
      message: '获取房间成员失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
