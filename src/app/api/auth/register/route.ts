import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validations';
import { ApiResponse, AuthResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入数据
    const validatedData = RegisterSchema.parse(body);
    const { username, password, email } = validatedData;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        message: '用户名已存在',
        code: 1,
        data: null
      }, { status: 400 });
    }

    // 如果提供了邮箱，检查邮箱是否已存在
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json<ApiResponse>({
          message: '邮箱已被使用',
          code: 1,
          data: null
        }, { status: 400 });
      }
    }

    // 创建新用户
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email || null,
      }
    });

    // 生成 JWT token
    const token = signToken({
      userId: user.id,
      username: user.username
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
      },
      token
    };

    return NextResponse.json<ApiResponse<AuthResponse>>({
      message: '注册成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>({
        message: error.message,
        code: 1,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      message: '注册失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}
